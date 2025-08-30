import React, { useEffect, useState } from 'react';
import { fetchTeams } from '../api';

function Teams() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    fetchTeams(token)
      .then(data => setMembers(data.members || []))
      .catch(() => setError('Failed to fetch team members'));
  }, []);

  return (
    <div>
      <h1>Teams Page</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {members.map(member => (
          <li key={member.id || member._id}>{member.name || member.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
