'use client';

import { useState } from 'react';

export default function TaskForm({ onTaskAdded }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      console.log('Sending data:', { name });
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date: new Date().toISOString() }),
      });
      console.log('Response status:', res.status);
      const text = await res.text();
      console.log('Response text:', text);
      if (!text) {
        throw new Error('Empty response from server');
      }
      const data = JSON.parse(text);
      console.log('Response data:', data);
      if (!res.ok) {
        console.error('Error response:', data);
        setError(data.error || 'Failed to add task');
        return;
      }
      setName('');
      setError('');
      if (onTaskAdded) onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la tâche"
        className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Ajouter
      </button>
    </form>
  );
}