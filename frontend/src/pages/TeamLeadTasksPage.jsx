import React, { useEffect, useState } from 'react';
import { Card, Elevation, FormGroup, InputGroup, Button, Callout, Spinner } from '@blueprintjs/core';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';

const TeamLeadTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateTask(token, editId, form);
      } else {
        await createTask(token, form);
      }
      setForm({ title: '', description: '' });
      setEditId(null);
      loadTasks();
    } catch {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setForm({ title: task.title || task.name, description: task.description || '' });
    setEditId(task.id || task._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTask(token, id);
      loadTasks();
    } catch {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 600, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Team Tasks</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FormGroup label="Title" labelFor="task-title-input" style={{ flex: 1 }}>
            <InputGroup id="task-title-input" name="title" value={form.title} onChange={handleChange} placeholder="Title" required large />
          </FormGroup>
          <FormGroup label="Description" labelFor="task-desc-input" style={{ flex: 2 }}>
            <InputGroup id="task-desc-input" name="description" value={form.description} onChange={handleChange} placeholder="Description" large />
          </FormGroup>
          <Button type="submit" intent={editId ? 'warning' : 'primary'} large style={{ marginTop: 24, minWidth: 120 }} disabled={loading}>
            {editId ? 'Update' : 'Create'} Task
          </Button>
          {editId && <Button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '' }); }} large style={{ marginTop: 24 }}>Cancel</Button>}
        </form>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id || task._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>
                  <strong>{task.title || task.name}</strong>
                  {task.description && <span style={{ color: '#888', fontSize: 14 }}> — {task.description}</span>}
                </span>
                <span>
                  <Button minimal icon="edit" intent="warning" onClick={() => handleEdit(task)} />
                  <Button minimal icon="trash" intent="danger" onClick={() => handleDelete(task.id || task._id)} />
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
