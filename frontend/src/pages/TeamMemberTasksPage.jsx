import React, { useEffect, useState } from 'react';
import { Card, Elevation, Button, Callout, Spinner } from '@blueprintjs/core';
import { fetchTasks, updateTask } from '../api';

const TeamMemberTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('access_token');

  const loadTasks = () => {
    if (!token) return;
    setLoading(true);
    fetchTasks(token)
      .then(data => setTasks(data.tasks || []))
      .catch(() => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, []);

  const handleMarkComplete = async (task) => {
    setLoading(true);
    try {
      await updateTask(token, task.id || task._id, { ...task, status: 'completed' });
      loadTasks();
    } catch {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>My Tasks</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id || task._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>
                  <strong>{task.title || task.name}</strong>
                  {task.status === 'completed' && <span style={{ color: 'green', marginLeft: 8 }}>(Completed)</span>}
                </span>
                {task.status !== 'completed' && (
                  <Button minimal icon="tick" intent="success" onClick={() => handleMarkComplete(task)}>
                    Mark Complete
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TeamMemberTasksPage;
