import { logError, logAllDebugMessages } from './loggerFeatureFlags';

vi.mock('../../config/featureFlags', () => ({
    featureFlag_Debug_Errors: true,
    featureFlag_Debug_AllLogs: true
  }));

describe('logger', () => {
  const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});

  test('logError logs errors when featureFlag_Debug_Errors is true', () => {
    const errorMsg = 'Test Error Message';
    const error = new Error('Test Error');
    logError(errorMsg, error);
    expect(consoleErrorMock).toHaveBeenCalledWith(errorMsg, error);
  });

  test('logAllDebugMessages does not log messages when featureFlag_Debug_AllLogs is true', () => {
    const message = 'Test Debug Message';
    logAllDebugMessages(message);
    expect(consoleLogMock).toHaveBeenCalledWith(message);
  });
});
