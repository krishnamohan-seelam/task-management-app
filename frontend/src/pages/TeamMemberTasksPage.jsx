import React, { useEffect, useState } from 'react';
import { Card, Elevation, Button, Callout, Spinner } from '@blueprintjs/core';
import { getTasksTM, updateTaskTM } from '../api';

const TeamMemberTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasksTM();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId) => {
    setError(null);
    try {
      await updateTaskTM(taskId, { status: 'completed' });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
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
                  <Button intent="success" small onClick={() => handleMarkComplete(task.id || task._id)}>
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
