import { NotAllowedStrings } from "../../config/notAllowedStrings";
import { logAllDebugMessages } from "../logger/loggerFeatureFlags";

export function containsNotAllowedCharacters(text: string): boolean {
  for (const notAllowedString of NotAllowedStrings) {
    if (text.includes(notAllowedString)) {
      logAllDebugMessages(`containsNotAllowedCharacters: ${text} contains ${notAllowedString}`);
      return true;
    }
  }
  return false;
}