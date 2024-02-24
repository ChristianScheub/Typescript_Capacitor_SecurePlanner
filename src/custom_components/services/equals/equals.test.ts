import { isEqual } from './equals';

describe('isEqual', () => {
  it('should return false when types of a and b are different', () => {
    expect(isEqual(1, '1')).toBe(false);
  });

  it('should return true when a and b are the same non-object type', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('test', 'test')).toBe(true);
  });

  it('should return false when a and b are arrays of different lengths', () => {
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('should return false when a and b are arrays that contain different elements', () => {
    expect(isEqual([1, 2], [1, 3])).toBe(false);
  });

  it('should return true when a and b are arrays that contain the same elements', () => {
    expect(isEqual([1, 2], [1, 2])).toBe(true);
  });

  it('should return false when a and b are objects with different keys', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
  });

  it('should return false when a and b are objects with the same keys but different values', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  it('should return true when a and b are objects with the same keys and values', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('should return false when a and b are objects with different number of keys', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBe(false);
  });
  
  it('should return true when a and b are objects with the same number of keys', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 3, b: 4 })).toBe(false);
  });
});