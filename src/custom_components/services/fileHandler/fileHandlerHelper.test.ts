import { generateFileName, downloadFile, processFileContent, readFileContent } from "./fileHandlerHelper";
import { makeReadyForImport } from "../encryptionEngine/encryptionEngine";
import { logAllDebugMessages, logError } from "../logger/loggerFeatureFlags";

// Mock external dependencies
jest.mock("../encryptionEngine/encryptionEngine");
jest.mock("../logger/loggerFeatureFlags");

describe("fileHandlerHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateFileName", () => {
    it("should generate a file name with the current date and time", () => {
      // Arrange
      const date = new Date("2024-07-07T14:30:15");
      jest.spyOn(global, "Date").mockImplementation(() => date as unknown as string);

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
      const createElementSpy = jest.spyOn(document, "createElement");
      const appendChildSpy = jest.spyOn(document.body, "appendChild");
      const removeChildSpy = jest.spyOn(document.body, "removeChild");

      // Mock createElement to return an anchor element
      const mockLink = document.createElement("a");
      mockLink.href = "";
      mockLink.download = "";
      mockLink.click = jest.fn();

      createElementSpy.mockReturnValue(mockLink);

      const createObjectURLMock = jest.fn().mockReturnValue("blob:test");
      const revokeObjectURLMock = jest.fn();
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
      (makeReadyForImport as jest.Mock).mockImplementation((value) => Promise.resolve(value));

      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

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
        readAsText: jest.fn(),
        onload: jest.fn(),
        onerror: jest.fn(),
        result: "file content",
      };

      jest.spyOn(window, "FileReader").mockImplementation(() => fileReaderMock as unknown as FileReader);

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
        readAsText: jest.fn(),
        onload: jest.fn(),
        onerror: jest.fn(),
        result: "file content",
        error: new Error("Read error"),
      };

      jest.spyOn(window, "FileReader").mockImplementation(() => fileReaderMock as unknown as FileReader);

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