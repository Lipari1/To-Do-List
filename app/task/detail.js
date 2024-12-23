import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks/${id}`)
        .then((res) => res.json())
        .then((data) => setTask(data))
        .catch((error) => console.error('Error fetching task:', error));
    }
  }, [id]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Task Detail</h1>
        <div className="text-black">
          <p>{task.content}</p>
        </div>
      </div>
    </div>
  );
}