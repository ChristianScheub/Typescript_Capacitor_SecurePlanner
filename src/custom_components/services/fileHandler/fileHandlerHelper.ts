import { makeReadyForImport } from "../encryptionEngine/encryptionEngine";
import { logAllDebugMessages } from "../logger/loggerFeatureFlags";

//needed for handleExportAllClick
export const generateFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `notes-${year}${month}${day}-${hours}${minutes}${seconds}.txt`;
};

export const downloadFile = (base64Data: string, fileName: string) => {
  const blob = new Blob([base64Data], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

//needed for handleFileChangeTranslation
export const processFileContent = async (content: string) => {
  const lines = content.trim().split("*_*_*");
  for (let i = 0; i < lines.length; i += 2) {
    const key = lines[i].slice(1);
    let value = lines[i + 1] ?? "";
    value = value.substring(1);
    value = await makeReadyForImport(value);
    if (key) {
      logAllDebugMessages("Import:" + key + "__INHALT__" + value);
      localStorage.setItem(key, value);
    }
  }
};

export const readFileContent = (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result;
      resolve(text as string);
    };

    reader.onerror = (event) => {
      reject(event.target?.error);
    };

    reader.readAsText(file);
  });
};
