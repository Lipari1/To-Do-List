import { openDb } from '../../../database/db.js';

export async function GET(request) {
  const db = openDb();
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId'); // Récupérer l'ID de la tâche principale

  try {
    if (!taskId) {
      console.error('Task ID is required');
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Récupérer les tâches quotidiennes associées à une tâche principale
    const dailyTasks = db
      .prepare('SELECT id, content, date FROM daily_tasks WHERE task_id = ?')
      .all(taskId);

    console.log('Fetched Daily Tasks:', dailyTasks);
    return new Response(JSON.stringify(dailyTasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch daily tasks', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request) {
  const db = openDb();

  try {
    const { taskId, content, date } = await request.json();

    if (!taskId || !content || !date) {
      console.error('Task ID, content, and date are required');
      return new Response(
        JSON.stringify({ error: 'Task ID, content, and date are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Vérifier si une tâche avec le même nom existe déjà
    const existingTask = db.prepare('SELECT id FROM tasks WHERE name = ?').get(content);
    const existingDailyTask = db.prepare('SELECT id FROM daily_tasks WHERE content = ?').get(content);
    if (existingTask || existingDailyTask) {
      return new Response(
        JSON.stringify({ error: 'Task with the same name already exists' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = db
      .prepare('INSERT INTO daily_tasks (task_id, content, date) VALUES (?, ?, ?)')
      .run(taskId, content, date);

    console.log('Inserted Daily Task:', { id: result.lastInsertRowid, taskId, content, date });
    return new Response(
      JSON.stringify({
        id: result.lastInsertRowid,
        taskId,
        content,
        date,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error inserting daily task:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request) {
  const db = openDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Récupérer l'ID de la tâche du jour

  try {
    if (!id) {
      console.error('Daily Task ID is required');
      return new Response(
        JSON.stringify({ error: 'Daily Task ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = db.prepare('DELETE FROM daily_tasks WHERE id = ?').run(id);

    if (result.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Daily Task not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Deleted Daily Task:', id);
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting daily task:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete daily task', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}