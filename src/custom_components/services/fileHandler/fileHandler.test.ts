import { MockInstance } from 'vitest';
import { logError } from "../logger/loggerFeatureFlags";
import {
  readFileContent,
  processFileContent,
} from "./fileHandlerHelper";
import SecurityLevel from "../../enums/SecurityLevel.enum";
import {
  handleFileChangeTranslation,
} from "./fileHandler";

// Mock Capacitor plugins and other dependencies
vi.mock("@capacitor/filesystem");
vi.mock("@capacitor/share");
vi.mock("../logger/loggerFeatureFlags");
vi.mock("../encryptionEngine/encryptionEngine");
vi.mock("./fileHandlerHelper");

describe("fileHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleFileChangeTranslation", () => {
    const t = (key: string) => key; // simple translation mock

    it("should show alert for wrong file type", async () => {
      // Arrange
      const alertMock = vi
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      const event = {
        target: {
          files: [
            {
              type: "application/json",
            },
          ],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Act
      await handleFileChangeTranslation(event, t);

      // Assert
      expect(alertMock).toHaveBeenCalledWith(
        "settings_Dialog_ImportWrongFiletype"
      );

      alertMock.mockRestore();
    });

    it("should handle file import with low security level", async () => {
      // Arrange
      localStorage.setItem("securityLevel", SecurityLevel.Low);
      const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);
      const alertMock = vi
        .spyOn(window, "alert")
        .mockImplementation(() => {});

      const event = {
        target: {
          files: [
            {
              type: "text/plain",
              text: () => Promise.resolve("file content"),
            },
          ],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      (readFileContent as any).mockResolvedValue("file content");

      // Act
      await handleFileChangeTranslation(event, t);

      // Assert
      expect(readFileContent).toHaveBeenCalled();
      expect(processFileContent).toHaveBeenCalledWith("file content");
      expect(alertMock).toHaveBeenCalledWith(
        "settings_Dialog_ImportSuccessful"
      );

      confirmMock.mockRestore();
      alertMock.mockRestore();
    });

    it("should log error if file processing fails", async () => {
      // Arrange
      localStorage.setItem("securityLevel", SecurityLevel.Low);
      const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);

      const event = {
        target: {
          files: [
            {
              type: "text/plain",
              text: () => Promise.resolve("file content"),
            },
          ],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      (readFileContent as any).mockRejectedValue(
        new Error("read failed")
      );

      // Act
      await handleFileChangeTranslation(event, t);

      // Assert
      expect(logError).toHaveBeenCalledWith(
        "fileHandler::handleFileChangeTranslation: Error processing file",
        expect.any(Error)
      );

      confirmMock.mockRestore();
    });

    it("should confirm before importing based on security level", async () => {
      // Arrange
      localStorage.setItem("securityLevel", SecurityLevel.High);
      localStorage.setItem("justOnePassword", "true");

      const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);

      const event = {
        target: {
          files: [
            {
              type: "text/plain",
              text: () => Promise.resolve("file content"),
            },
          ],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      (readFileContent as any).mockResolvedValue("file content");

      // Act
      await handleFileChangeTranslation(event, t);

      // Assert
      expect(window.confirm).toHaveBeenCalledTimes(1);
      expect(readFileContent).toHaveBeenCalled();
      expect(processFileContent).toHaveBeenCalledWith("file content");

      confirmMock.mockRestore();
    });

    it("should not import if confirm is cancelled", async () => {
      // Arrange
      localStorage.setItem("securityLevel", SecurityLevel.High);
      localStorage.setItem("justOnePassword", "true");

      const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(false);

      const event = {
        target: {
          files: [
            {
              type: "text/plain",
            },
          ],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Act
      await handleFileChangeTranslation(event, t);

      // Assert
      expect(readFileContent).not.toHaveBeenCalled();
      expect(processFileContent).not.toHaveBeenCalled();

      confirmMock.mockRestore();
    });
  });
});
