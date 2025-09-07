import React, { useEffect, useState } from 'react';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';
import { getTasksTL, assignTaskTL, updateTaskTL, trackTasksTL } from '../api';

const TeamLeadTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignData, setAssignData] = useState({ taskId: '', userId: '' });
  const [updateData, setUpdateData] = useState({ taskId: '', status: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasksTL();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await assignTaskTL(assignData);
      setAssignData({ taskId: '', userId: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to assign task');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateTaskTL(updateData.taskId, { status: updateData.status });
      setUpdateData({ taskId: '', status: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Team Lead: Tasks</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        <form onSubmit={handleAssignTask} style={{ marginBottom: 24 }}>
          <FormGroup label="Task ID" labelFor="assign-task-id">
            <InputGroup id="assign-task-id" value={assignData.taskId} onChange={e => setAssignData({ ...assignData, taskId: e.target.value })} placeholder="Task ID" required />
          </FormGroup>
          <FormGroup label="User ID" labelFor="assign-user-id">
            <InputGroup id="assign-user-id" value={assignData.userId} onChange={e => setAssignData({ ...assignData, userId: e.target.value })} placeholder="User ID" required />
          </FormGroup>
          <Button type="submit" intent="success">Assign Task</Button>
        </form>
        <form onSubmit={handleUpdateTask} style={{ marginBottom: 24 }}>
          <FormGroup label="Task ID" labelFor="update-task-id">
            <InputGroup id="update-task-id" value={updateData.taskId} onChange={e => setUpdateData({ ...updateData, taskId: e.target.value })} placeholder="Task ID" required />
          </FormGroup>
          <FormGroup label="Status" labelFor="update-status">
            <InputGroup id="update-status" value={updateData.status} onChange={e => setUpdateData({ ...updateData, status: e.target.value })} placeholder="Status" required />
          </FormGroup>
          <Button type="submit" intent="primary">Update Task</Button>
        </form>
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id || task._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>
                  <strong>{task.title || task.name}</strong>
                  {task.description && <span style={{ color: '#888', fontSize: 14 }}> — {task.description}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TeamLeadTasksPage;
