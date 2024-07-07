import { containsNotAllowedCharacters } from './containsNotAllowedCharacters';
import * as loggerFeatureFlagsModule from '../logger/loggerFeatureFlags';

// Mock der Abhängigkeiten
jest.mock('../../config/notAllowedStrings', () => ({
  NotAllowedStrings: ['abc', 'def'],
}));

jest.mock('../logger/loggerFeatureFlags', () => ({
  logAllDebugMessages: jest.fn(),
}));

describe('containsNotAllowedCharacters', () => {
  it('should return false if no non-permitted characters are contained', () => {
    const result = containsNotAllowedCharacters('ghi');
    expect(result).toBe(false);
  });

  it('should return true and call logAllDebugMessages if non-permitted characters are contained', () => {
    const spyLogAllDebugMessages = jest.spyOn(loggerFeatureFlagsModule, 'logAllDebugMessages');
    const result = containsNotAllowedCharacters('abc');
    expect(result).toBe(true);
    expect(spyLogAllDebugMessages).toHaveBeenCalledWith(expect.stringContaining('abc contains abc'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});