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

export const handleExportAllClick = async () => {
  let notes = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) {
      const item = localStorage.getItem(key);
      if (item !== null) {
        const value = await makeReadyForExport(item);
        notes += ` ${key}*_*_* ${value}*_*_*`;
      }
    }
  }

  try {
    const fileName = generateFileName();
    const base64Data = btoa(notes);

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
    });

    try {
      const uriResult = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName,
      });

      await Share.share({
        url: uriResult.uri,
      });
    } catch (shareError) {
      downloadFile(notes, fileName);
    }
  } catch (e) {
    logError("fileHandler::handleExportAllClick: Error during export or sharing", e);
  }
};

export const handleFileChangeTranslation = async (
  event: React.ChangeEvent<HTMLInputElement>,
  t: (key: string) => string
) => {
  const file = event.target.files ? event.target.files[0] : null;

  if (!file || file.type !== "text/plain") {
    alert(t("settings_Dialog_ImportWrongFiletype"));
    return;
  }

  if (localStorage.getItem("securityLevel") === SecurityLevel.Low) {
    if (!window.confirm(t("settings_Dialog_ImportNoPass")) || !file) return;

  } else if (localStorage.getItem("justOnePassword") === "true") {
    if (!window.confirm(t("settings_Dialog_ImportJustOne")) || !file) return;

  } else if (!window.confirm(t("settings_Dialog_Import")) || !file) {
    return;
  }
  

  try {
    const fileContent = await readFileContent(file);
    if (fileContent) {
      await processFileContent(fileContent);
      alert(t("settings_Dialog_ImportSuccessful"));
    }
  } catch (error) {
    logError("fileHandler::handleFileChangeTranslation: Error processing file", error);
  }
};
