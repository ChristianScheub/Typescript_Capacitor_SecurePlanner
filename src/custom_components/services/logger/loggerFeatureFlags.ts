import { featureFlag_Debug_Errors,featureFlag_Debug_AllLogs } from "../../config/featureFlags";


export function logError(errorMsg: string, error: unknown): void {
  if (featureFlag_Debug_Errors) {
    console.error(errorMsg, error);
  }
}

export function logAllDebugMessages(message: string): void {
  if (featureFlag_Debug_AllLogs) {
    console.log(message);
  }
}