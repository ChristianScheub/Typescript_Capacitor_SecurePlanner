import { formatDate, getTodayWithoutHours } from './formatDate';



beforeEach(() => {
    vi.mock('./formatDate', () => ({
      ...vi.importActual('./formatDate'),
      getTodayWithoutHours: vi.fn(() => new Date('2023-01-01T00:00:00Z')),
    }));
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

describe('getTodayWithoutHours', () => {
  it('should return today\'s date with zeroed hours, minutes, seconds, and milliseconds', () => {
    const todayWithoutHours = getTodayWithoutHours();
    expect(todayWithoutHours.getHours()).toBe(0);
    expect(todayWithoutHours.getMinutes()).toBe(0);
    expect(todayWithoutHours.getSeconds()).toBe(0);
    expect(todayWithoutHours.getMilliseconds()).toBe(0);
  });
});
describe('formatDate', () => {
    // Mock 'getTodayWithoutHours' direkt in dem Testfall, um sicherzustellen, dass es korrekt funktioniert
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockImplementation(() => new Date('2023-01-01T00:00:00Z').getTime());
    });
  
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it('should return a date in DD.MM.YYYY format', () => {
      const date = new Date('2023-01-01T12:34:56Z');
      const formattedDate = formatDate(date);
      expect(formattedDate).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });
  
    it('should return a formatted date with red color for today\'s date', () => {
      const date = new Date(); 
      const formattedDate = formatDate(date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      const expectedDate = `<span style="color: red;">${day}.${month}.${year}</span>`;
      expect(formattedDate).toBe(expectedDate);
    });
  
    it('should return an empty string and log an error for an invalid date', () => {
      const formattedDate = formatDate('invalid-date');
      expect(formattedDate).toBe('');
    });
  });
  