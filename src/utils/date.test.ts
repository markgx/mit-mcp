import { describe, it, expect } from 'vitest';

import { getLocalDateString } from './date.js';

describe('getLocalDateString', () => {
  describe('default behavior (no date parameter)', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const today = new Date();
      const expectedYear = today.getFullYear();
      const expectedMonth = String(today.getMonth() + 1).padStart(2, '0');
      const expectedDay = String(today.getDate()).padStart(2, '0');
      const expected = `${expectedYear}-${expectedMonth}-${expectedDay}`;

      const result = getLocalDateString();

      expect(result).toBe(expected);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('with custom date parameter', () => {
    it('should format a specific date correctly', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const result = getLocalDateString(date);
      expect(result).toBe('2025-01-15');
    });

    it('should pad single-digit months with zero', () => {
      const date = new Date(2025, 4, 20); // May 20, 2025 (month is 0-indexed)
      const result = getLocalDateString(date);
      expect(result).toBe('2025-05-20');
    });

    it('should pad single-digit days with zero', () => {
      const date = new Date(2025, 11, 5); // December 5, 2025
      const result = getLocalDateString(date);
      expect(result).toBe('2025-12-05');
    });

    it('should handle both single-digit month and day', () => {
      const date = new Date(2025, 2, 7); // March 7, 2025
      const result = getLocalDateString(date);
      expect(result).toBe('2025-03-07');
    });

    it('should handle year boundaries - December 31', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      const result = getLocalDateString(date);
      expect(result).toBe('2024-12-31');
    });

    it('should handle year boundaries - January 1', () => {
      const date = new Date(2025, 0, 1); // January 1, 2025
      const result = getLocalDateString(date);
      expect(result).toBe('2025-01-01');
    });

    it('should handle leap year - February 29', () => {
      const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)
      const result = getLocalDateString(date);
      expect(result).toBe('2024-02-29');
    });
  });

  describe('timezone consistency', () => {
    it('should return same date regardless of time component', () => {
      const baseDate = new Date(2025, 5, 15); // June 15, 2025

      // Test various times of the same day
      const morning = new Date(2025, 5, 15, 1, 0, 0);
      const noon = new Date(2025, 5, 15, 12, 0, 0);
      const evening = new Date(2025, 5, 15, 23, 59, 59);

      const expected = '2025-06-15';
      expect(getLocalDateString(baseDate)).toBe(expected);
      expect(getLocalDateString(morning)).toBe(expected);
      expect(getLocalDateString(noon)).toBe(expected);
      expect(getLocalDateString(evening)).toBe(expected);
    });

    it('should use local date components, not UTC', () => {
      // Create a date where local and UTC might differ
      // For example, 11 PM local time might be next day in UTC
      const date = new Date(2025, 5, 15, 23, 0, 0);
      const result = getLocalDateString(date);

      // The result should be based on local date components
      expect(result).toBe('2025-06-15');
    });
  });

  describe('format validation', () => {
    it('should always return YYYY-MM-DD format', () => {
      const testDates = [
        new Date(2025, 0, 1),
        new Date(2025, 11, 31),
        new Date(2025, 5, 15),
        new Date(1999, 8, 9),
        new Date(2050, 9, 10),
      ];

      testDates.forEach(date => {
        const result = getLocalDateString(date);
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(result.length).toBe(10);
        expect(result[4]).toBe('-');
        expect(result[7]).toBe('-');
      });
    });
  });
});
