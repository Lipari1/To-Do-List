import { openDb } from '../../../../database/db.js';

export async function GET(request, { params }) {
  const db = openDb();
  const { id } = params; // Récupérer l'ID de la tâche à partir des paramètres

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id); // Récupérer la tâche par ID

  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }); // Renvoie une erreur si la tâche n'est pas trouvée
  }

  return new Response(JSON.stringify(task), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }); // Renvoie la tâche trouvée
}

export async function PUT(request, { params }) {
  const db = openDb();
  const { id } = params; // Récupérer l'ID de la tâche à partir des paramètres
  const { content } = await request.json(); // Récupérer le contenu de la requête

  const result = db.prepare('UPDATE tasks SET content = ? WHERE id = ?').run(content, id); // Mettre à jour la tâche

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }); // Renvoie une erreur si la tâche n'est pas trouvée
  }

  return new Response(JSON.stringify({ message: 'Task updated' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }); // Renvoie un message de succès si la tâche a été mise à jour
}

export async function DELETE(request, { params }) {
  const db = openDb();
  const { id } = params; // Récupérer l'ID de la tâche à partir des paramètres

  try {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id); // Supprimer la tâche par ID

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }); // Renvoie une erreur si la tâche n'est pas trouvée
    }

    return new Response(JSON.stringify({ message: 'Task deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }); // Renvoie un message de succès si la tâche a été supprimée
  } catch (error) {
    console.error('Error deleting task:', error); // Log de l'erreur de suppression
    return new Response(
      JSON.stringify({ error: 'Failed to delete task', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    ); // Renvoie une erreur en cas d'échec de la suppression
  }
}