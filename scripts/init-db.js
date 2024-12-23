import { openDb } from '../database/db.js';

function initDb() {
  try {
    const db = openDb();

    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL
      )
    `);

    console.log('Table "tasks" initialisée avec succès.');
    db.close();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données :', error.message);
  }
}

initDb();
