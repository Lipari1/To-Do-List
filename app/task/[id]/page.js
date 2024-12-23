'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks?id=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch task');
          }
          return res.json();
        })
        .then((data) => {
          setTask(data);
          setContent(data.content);
        })
        .catch((error) => console.error('Error fetching task:', error));
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        throw new Error('Failed to save task');
      }
      alert('Description mise à jour avec succès !');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">{task.name}</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
        />
        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded mb-2"
        >
          Enregistrer
        </button>
        <button
          onClick={() => router.back()}
          className="w-full p-2 bg-gray-500 text-white rounded"
        >
          Retour
        </button>
      </div>
    </div>
  );
}