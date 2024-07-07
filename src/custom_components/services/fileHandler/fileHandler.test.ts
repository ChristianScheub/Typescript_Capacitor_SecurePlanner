import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { logError } from "../logger/loggerFeatureFlags";
import { makeReadyForExport } from "../encryptionEngine/encryptionEngine";
import {
  downloadFile,
  generateFileName,
  readFileContent,
  processFileContent,
} from "./fileHandlerHelper";
import SecurityLevel from "../../enums/SecurityLevel.enum";
import {
  handleExportAllClick,
  handleFileChangeTranslation,
} from "./fileHandler";

// Mock Capacitor plugins and other dependencies
jest.mock("@capacitor/filesystem");
jest.mock("@capacitor/share");
jest.mock("../logger/loggerFeatureFlags");
jest.mock("../encryptionEngine/encryptionEngine");
jest.mock("./fileHandlerHelper");

describe("fileHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleFileChangeTranslation", () => {
    const t = (key: string) => key; // simple translation mock

    it("should show alert for wrong file type", async () => {
      // Arrange
      const alertMock = jest
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
      const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);
      const alertMock = jest
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

      (readFileContent as jest.Mock).mockResolvedValue("file content");

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
      const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);

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

      (readFileContent as jest.Mock).mockRejectedValue(
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

      const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);

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

      (readFileContent as jest.Mock).mockResolvedValue("file content");

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

      const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(false);

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
