'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTaskContent, setSelectedTaskContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
    fetchDailyTasks();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await res.json();
      console.log('Fetched Task:', data);
      setTask(data);
      setContent(data.content);
      setDate(new Date(data.date));
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const fetchDailyTasks = async () => {
    try {
      const res = await fetch(`/api/daily-tasks?taskId=${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch daily tasks');
      }
      const data = await res.json();
      console.log('Fetched Daily Tasks:', data);
      setDailyTasks(data);
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, date }),
      });
      if (!res.ok) {
        throw new Error('Failed to save task');
      }
      alert('Description mise à jour avec succès !');
      fetchTask();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const taskForDate = dailyTasks.find((task) => new Date(task.date).toDateString() === date.toDateString());
    setSelectedTaskContent(taskForDate ? taskForDate.content : '');
  };

  const handleSelectedTaskContentChange = (e) => {
    setSelectedTaskContent(e.target.value);
  };

  const handleSaveSelectedTask = async () => {
    try {
      const res = await fetch('/api/daily-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: id, content: selectedTaskContent, date: selectedDate.toISOString() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save daily task');
        throw new Error('Failed to save daily task');
      }
      alert('Tâche enregistrée avec succès !');
      fetchDailyTasks();
      setSelectedTaskContent(''); // Clear the input field after saving
      setError(''); // Clear any previous error
    } catch (error) {
      console.error('Error saving daily task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/daily-tasks?id=${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      alert('Tâche supprimée avec succès !');
      fetchDailyTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = (taskId) => {
    setDailyTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const taskDates = dailyTasks.map((task) => new Date(task.date).toDateString());
      const today = new Date();
      if (taskDates.includes(date.toDateString())) {
        if (date < today) {
          return 'bg-red-500 text-white';
        }
        return 'bg-green-500 text-white';
      }
    }
    return null;
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black flex">
      <div className="w-1/4 p-4 bg-gray-800 text-white overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tâches pour {selectedDate ? selectedDate.toDateString() : '...'}</h2>
        <ul>
          {dailyTasks
            .filter((task) => new Date(task.date).toDateString() === (selectedDate ? selectedDate.toDateString() : ''))
            .map((task) => (
              <li key={task.id} className="mb-2 flex items-center">
                <span className={`text-white ${task.completed ? 'line-through' : ''}`}>{task.content}</span>
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="ml-2 p-1 bg-gray-600 text-white rounded"
                >
                  &#x2713;
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-2 p-1 bg-red-600 text-white rounded"
                >
                  &#x2715;
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="w-3/4 p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">{task.name}</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
          value={content}
          onChange={handleContentChange}
          rows="10"
        />
        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded mb-2"
        >
          Enregistrer la tâche principale
        </button>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate || date}
          className="mb-4"
          tileClassName={tileClassName}
        />
        {selectedDate && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2 text-black">Tâche pour {selectedDate.toDateString()}</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              value={selectedTaskContent}
              onChange={handleSelectedTaskContentChange}
              rows="5"
            />
            <button
              onClick={handleSaveSelectedTask}
              className="w-full p-2 bg-blue-500 text-white rounded mb-2"
            >
              Enregistrer la tâche du jour
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
        <button
          onClick={() => router.push('/')}
          className="w-full p-2 bg-gray-500 text-white rounded"
        >
          Retour
        </button>
      </div>
    </div>
  );
}