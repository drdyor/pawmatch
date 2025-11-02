// src/lib/case.ts
// Snake_case ↔ camelCase adapter utilities for database ↔ UI layer conversion

type AnyObj = Record<string, any>;

/**
 * Convert snake_case key to camelCase
 */
const toCamelKey = (k: string): string => {
  return k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
};

/**
 * Convert camelCase key to snake_case
 */
const toSnakeKey = (k: string): string => {
  return k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
};

/**
 * Convert a database row (snake_case) to camelCase for UI consumption
 */
export const toCamel = <T extends AnyObj>(row: T): any => {
  if (!row || typeof row !== 'object') return row;
  
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [
      toCamelKey(k),
      Array.isArray(v) ? v.map(item => typeof item === 'object' ? toCamel(item) : item) : v
    ])
  );
};

/**
 * Convert a UI object (camelCase) to snake_case for database operations
 */
export const toSnake = <T extends AnyObj>(obj: T): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      toSnakeKey(k),
      Array.isArray(v) ? v.map(item => typeof item === 'object' ? toSnake(item) : item) : v
    ])
  );
};

/**
 * Map an array of database rows to camelCase
 */
export const mapCamel = <T extends AnyObj>(rows: T[] | null | undefined): any[] => {
  if (!rows || !Array.isArray(rows)) return [];
  return rows.map(toCamel);
};

/**
 * Map an array of UI objects to snake_case
 */
export const mapSnake = <T extends AnyObj>(rows: T[]): any[] => {
  if (!rows || !Array.isArray(rows)) return [];
  return rows.map(toSnake);
};
