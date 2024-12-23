import Database from 'better-sqlite3';

export function openDb() {
  const db = new Database('./tasks.db');
  return db;
}