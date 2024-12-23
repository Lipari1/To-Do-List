import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Ouverture de la base de données SQLite
export async function openDb() {
  return open({
    filename: './tasks.db',
    driver: sqlite3.Database,
  });
}