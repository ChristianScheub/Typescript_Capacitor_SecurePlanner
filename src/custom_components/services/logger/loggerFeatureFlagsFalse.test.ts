import { logError, logAllDebugMessages } from './loggerFeatureFlags';

jest.mock('../../config/featureFlags', () => ({
    featureFlag_Debug_Errors: false,
    featureFlag_Debug_AllLogs: false
  }));

describe('logger', () => {
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});


  test('logError does not log errors when featureFlag_Debug_Errors is false', () => {
    logError('Test Error Message', new Error('Test Error'));
    expect(consoleErrorMock).not.toHaveBeenCalled();
  });

  test('logAllDebugMessages does not log messages when featureFlag_Debug_AllLogs is false', () => {
    const message = 'Test Debug Message';
    logAllDebugMessages(message);
    expect(consoleLogMock).not.toHaveBeenCalled();
  });
});
