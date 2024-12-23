import { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '../../../database/db.js';

export default async function handler(req, res) {
  const db = openDb();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    // Supprimer une tâche par ID
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json({ message: 'Task deleted' });
    }
  }
}
