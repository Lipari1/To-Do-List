'use client';

import { useState, useEffect } from 'react';

export default function TaskDetail({ params }) {
  const { id } = params;
  const [content, setContent] = useState('');

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch task');
      const data = await res.json();
      setContent(data.content);
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const updateContent = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      alert('Description mise à jour avec succès !');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier la Tâche</h1>
      <textarea
        value={content} // Valeur du contenu de la tâche
        onChange={(e) => setContent(e.target.value)} // Met à jour le contenu de la tâche lors de la modification
        rows="4"
        className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
      />
      <button
        onClick={updateContent} // Appelle la fonction pour mettre à jour le contenu de la tâche
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Enregistrer
      </button>
    </div>
  );
}

