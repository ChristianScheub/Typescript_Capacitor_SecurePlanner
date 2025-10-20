import { MockInstance } from 'vitest';
import { generateFileName, downloadFile, processFileContent, readFileContent } from "./fileHandlerHelper";
import { makeReadyForImport } from "../encryptionEngine/encryptionEngine";
import { logAllDebugMessages, logError } from "../logger/loggerFeatureFlags";

// Mock external dependencies
vi.mock("../encryptionEngine/encryptionEngine");
vi.mock("../logger/loggerFeatureFlags");

describe("fileHandlerHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateFileName", () => {
    it("should generate a file name with the current date and time", () => {
      // Arrange
      const date = new Date("2024-07-07T14:30:15");
      vi.spyOn(global, "Date").mockImplementation((() => date) as any);

      // Act
      const fileName = generateFileName();

      // Assert
      expect(fileName).toBe("notes-20240707-143015.txt");
    });
  });

  describe("downloadFile", () => {
    it("should create a downloadable link and trigger a download", () => {
      // Arrange
      const base64Data = "dGVzdCBkYXRh"; // base64 for "test data"
      const fileName = "testFile.txt";
      const createElementSpy = vi.spyOn(document, "createElement");
      const appendChildSpy = vi.spyOn(document.body, "appendChild");
      const removeChildSpy = vi.spyOn(document.body, "removeChild");

      // Mock createElement to return an anchor element
      const mockLink = document.createElement("a");
      mockLink.href = "";
      mockLink.download = "";
      mockLink.click = vi.fn();

      createElementSpy.mockReturnValue(mockLink);

      const createObjectURLMock = vi.fn().mockReturnValue("blob:test");
      const revokeObjectURLMock = vi.fn();
      // @ts-ignore
      global.URL.createObjectURL = createObjectURLMock;
      // @ts-ignore
      global.URL.revokeObjectURL = revokeObjectURLMock;

      // Act
      downloadFile(base64Data, fileName);

      // Assert
      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockLink.href).toBe("blob:test");
      expect(mockLink.download).toBe(fileName);
      expect(mockLink.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:test");
    });
  });

  describe("processFileContent", () => {
    it("should process the file content and store it in localStorage", async () => {
      // Arrange
      const content = " note1*_*_* value1*_*_* note2*_*_* value2*_*_*";
      (makeReadyForImport as any).mockImplementation((value: any) => Promise.resolve(value));

      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      // Act
      await processFileContent(content);

      // Assert
      expect(setItemSpy).toHaveBeenCalledWith("note1", "value1");
      expect(setItemSpy).toHaveBeenCalledWith("note2", "value2");
      expect(logAllDebugMessages).toHaveBeenCalledWith("FileHandlerHelper::processFileContent::Import:note1__INHALT__value1");
      expect(logAllDebugMessages).toHaveBeenCalledWith("FileHandlerHelper::processFileContent::Import:note2__INHALT__value2");
    });
  });

  describe("readFileContent", () => {
    it("should read the content of the file", async () => {
      // Arrange
      const file = new File(["file content"], "test.txt", { type: "text/plain" });
      const fileReaderMock = {
        readAsText: vi.fn(),
        onload: vi.fn(),
        onerror: vi.fn(),
        result: "file content",
      };

      vi.spyOn(window, "FileReader").mockImplementation(() => fileReaderMock as unknown as FileReader);

      // Act
      const promise = readFileContent(file);
      fileReaderMock.onload!({ target: { result: "file content" } } as ProgressEvent<FileReader>);
      const content = await promise;

      // Assert
      expect(fileReaderMock.readAsText).toHaveBeenCalledWith(file);
      expect(content).toBe("file content");
    });

    it("should handle read error", async () => {
      // Arrange
      const file = new File(["file content"], "test.txt", { type: "text/plain" });
      const fileReaderMock = {
        readAsText: vi.fn(),
        onload: vi.fn(),
        onerror: vi.fn(),
        result: "file content",
        error: new Error("Read error"),
      };

      vi.spyOn(window, "FileReader").mockImplementation(() => fileReaderMock as unknown as FileReader);

      // Act
      const promise = readFileContent(file);
      fileReaderMock.onerror!({ target: { error: new Error("Read error") } } as ProgressEvent<FileReader>);

      // Assert
      await expect(promise).rejects.toThrow("Read error");
      expect(logError).toHaveBeenCalledWith(
        "fileHandlerHelper::readFileContent: Error while reading the file",
        new Error("Read error")
      );
    });
  });
});