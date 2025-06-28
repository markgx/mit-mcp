import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { Mit } from '../db/schema.js';

import { mitService } from './mitService.js';

// Helper functions for dynamic dates
const getToday = () => new Date().toISOString().split('T')[0];
const getFutureDate = (daysAhead = 1) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Create properly typed mocks
const mockFrom = vi.fn();
const mockValues = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockSet = vi.fn();
const mockReturning = vi.fn();

// Mock the database module
vi.mock('../db/index.js', () => ({
  db: {
    select: () => ({
      from: mockFrom,
      where: mockWhere,
      orderBy: mockOrderBy,
    }),
    insert: () => ({
      values: mockValues,
      returning: mockReturning,
    }),
    update: () => ({
      set: mockSet,
      where: mockWhere,
      returning: mockReturning,
    }),
    delete: () => ({
      where: mockWhere,
      returning: mockReturning,
    }),
  },
}));

describe('mitService', () => {
  // Calculate dates once for all tests
  const today = getToday();
  const tomorrow = getFutureDate();
  const threeDaysAhead = getFutureDate(3);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();

    // Reset mock implementations
    mockFrom.mockReturnValue({ where: mockWhere, orderBy: mockOrderBy });
    mockWhere.mockReturnValue({
      orderBy: mockOrderBy,
      returning: mockReturning,
    });
    mockOrderBy.mockReturnValue({ returning: mockReturning });
    mockValues.mockReturnValue({ returning: mockReturning });
    mockSet.mockReturnValue({ where: mockWhere, returning: mockReturning });
  });

  describe('create', () => {
    it('should create a new MIT with provided order', async () => {
      const mockMit: Mit = {
        id: '123',
        description: 'Test MIT',
        completed: false,
        order: 1,
        date: today,
        createdAt: '2025-06-27T00:00:00.000Z',
        updatedAt: '2025-06-27T00:00:00.000Z',
      };

      // Mock empty existing MITs
      mockOrderBy.mockResolvedValueOnce([]);

      // Mock the insert operation
      mockReturning.mockResolvedValueOnce([mockMit]);

      const result = await mitService.create('Test MIT', 1, today);

      expect(result).toEqual([mockMit]);
      expect(mockValues).toHaveBeenCalledWith({
        description: 'Test MIT',
        order: 1,
        date: today,
      });
    });

    it('should calculate order automatically when not provided', async () => {
      const existingMits: Mit[] = [
        {
          id: '1',
          description: 'MIT 1',
          completed: false,
          order: 1,
          date: today,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
        {
          id: '2',
          description: 'MIT 2',
          completed: false,
          order: 3,
          date: today,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
      ];

      // Mock existing MITs
      mockOrderBy.mockResolvedValueOnce(existingMits);

      const newMit: Mit = {
        id: '3',
        description: 'New MIT',
        completed: false,
        order: 4, // Should be max order + 1
        date: today,
        createdAt: '2025-06-27T00:00:00.000Z',
        updatedAt: '2025-06-27T00:00:00.000Z',
      };

      mockReturning.mockResolvedValueOnce([newMit]);

      const result = await mitService.create('New MIT', undefined, today);

      expect(result[0].order).toBe(4);
      expect(mockValues).toHaveBeenCalledWith({
        description: 'New MIT',
        order: 4,
        date: today,
      });
    });

    it('should throw error when creating MIT for past date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastDate = yesterday.toISOString().split('T')[0];

      await expect(mitService.create('Past MIT', 1, pastDate)).rejects.toThrow(
        'Cannot create MITs for past dates',
      );
    });

    it('should throw error when exceeding MAX_MITS_PER_DAY (default 3)', async () => {
      // Use a future date to avoid past date validation
      const futureDate = tomorrow;

      // Create 3 existing MITs (the default maximum)
      const existingMits: Mit[] = [
        {
          id: '1',
          description: 'MIT 1',
          completed: false,
          order: 1,
          date: futureDate,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
        {
          id: '2',
          description: 'MIT 2',
          completed: false,
          order: 2,
          date: futureDate,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
        {
          id: '3',
          description: 'MIT 3',
          completed: false,
          order: 3,
          date: futureDate,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
      ];

      mockOrderBy.mockResolvedValueOnce(existingMits);

      await expect(mitService.create('New MIT', 4, futureDate)).rejects.toThrow(
        `Daily limit of 3 MITs reached for ${futureDate}`,
      );
    });
  });

  describe('findAll', () => {
    it('should return all MITs ordered by order', async () => {
      const mockMits: Mit[] = [
        {
          id: '1',
          description: 'MIT 1',
          completed: false,
          order: 1,
          date: today,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
        {
          id: '2',
          description: 'MIT 2',
          completed: true,
          order: 2,
          date: today,
          createdAt: '2025-06-27T00:00:00.000Z',
          updatedAt: '2025-06-27T00:00:00.000Z',
        },
      ];

      mockOrderBy.mockResolvedValueOnce(mockMits);

      const result = await mitService.findAll();

      expect(result).toEqual(mockMits);
      expect(mockFrom).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();
    });
  });

  describe('findByDate', () => {
    it('should return MITs for specific date', async () => {
      const mockMits: Mit[] = [
        {
          id: '1',
          description: 'MIT for specific date',
          completed: false,
          order: 1,
          date: tomorrow,
          createdAt: '2025-06-28T00:00:00.000Z',
          updatedAt: '2025-06-28T00:00:00.000Z',
        },
      ];

      mockOrderBy.mockResolvedValueOnce(mockMits);

      const result = await mitService.findByDate(tomorrow);

      expect(result).toEqual(mockMits);
      expect(mockWhere).toHaveBeenCalled();
    });

    it('should return empty array when no MITs found for date', async () => {
      mockOrderBy.mockResolvedValueOnce([]);

      const result = await mitService.findByDate(threeDaysAhead);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update MIT with partial data', async () => {
      const updatedMit: Mit = {
        id: '123',
        description: 'Updated MIT',
        completed: true,
        order: 1,
        date: today,
        createdAt: '2025-06-27T00:00:00.000Z',
        updatedAt: '2025-06-27T10:00:00.000Z',
      };

      mockReturning.mockResolvedValueOnce([updatedMit]);

      const result = await mitService.update('123', {
        description: 'Updated MIT',
        completed: true,
      });

      expect(result).toEqual([updatedMit]);
      expect(mockSet).toHaveBeenCalledWith({
        description: 'Updated MIT',
        completed: true,
      });
    });

    it('should return empty array when MIT not found', async () => {
      mockReturning.mockResolvedValueOnce([]);

      const result = await mitService.update('non-existent', {
        completed: true,
      });

      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete MIT by id', async () => {
      const deletedMit: Mit = {
        id: '123',
        description: 'To be deleted',
        completed: false,
        order: 1,
        date: today,
        createdAt: '2025-06-27T00:00:00.000Z',
        updatedAt: '2025-06-27T00:00:00.000Z',
      };

      mockReturning.mockResolvedValueOnce([deletedMit]);

      const result = await mitService.delete('123');

      expect(result).toEqual([deletedMit]);
      expect(mockWhere).toHaveBeenCalled();
    });

    it('should return empty array when MIT not found', async () => {
      mockReturning.mockResolvedValueOnce([]);

      const result = await mitService.delete('non-existent');

      expect(result).toEqual([]);
    });
  });
});
