import { openDb } from '../database/db.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database/database.sqlite');

// Supprimez l'ancienne base de données si elle existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

function initDb() {
  try {
    const db = openDb();
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        isDailyTask INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS daily_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDb();