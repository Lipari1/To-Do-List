import { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '../../../database/db.js';

export default async function handler(req, res) {
  const db = openDb();

  if (req.method === 'GET') {
    // Lire toutes les tâches
    const tasks = db.prepare('SELECT * FROM tasks').all();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    // Ajouter une nouvelle tâche
    const stmt = db.prepare('INSERT INTO tasks (content) VALUES (?)');
    const result = stmt.run(content);
    res.status(201).json({ id: result.lastInsertRowid, content });
  }
}
