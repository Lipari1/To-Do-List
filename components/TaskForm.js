'use client';

import { useState } from 'react';

export default function TaskForm({ onTaskAdded }) {
  const [name, setName] = useState(''); // État pour stocker le nom de la tâche
  const [error, setError] = useState(''); // État pour stocker les messages d'erreur

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return; // Vérifie que le nom n'est pas vide

    try {
      console.log('Sending data:', { name }); // Log des données envoyées
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date: new Date().toISOString(), content: '', isDailyTask: false }), // Envoie les données de la tâche au serveur
      });
      console.log('Response status:', res.status); // Log du statut de la réponse
      const text = await res.text();
      console.log('Response text:', text); // Log du texte de la réponse
      if (!text) {
        throw new Error('Empty response from server'); // Vérifie que la réponse n'est pas vide
      }
      const data = JSON.parse(text);
      console.log('Response data:', data); // Log des données de la réponse
      if (!res.ok) {
        console.error('Error response:', data); // Log de l'erreur si la réponse n'est pas OK
        setError(data.error || 'Failed to add task'); // Met à jour l'état avec le message d'erreur
        return;
      }
      setName(''); // Réinitialise le nom de la tâche
      setError(''); // Réinitialise les messages d'erreur
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