import React, { useEffect, useState } from 'react';
import { Card, Elevation, Button, Callout, Spinner } from '@blueprintjs/core';
import { fetchTeams } from '../api';

const TeamLeadTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setLoading(true);
    fetchTeams(token)
      .then(data => setTeams(data.teams || []))
      .catch(() => setError('Failed to fetch teams'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f5f8fa' }}>
      <Card elevation={Elevation.TWO} style={{ width: 500, marginTop: 40, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Manage Teams</h2>
        {error && <Callout intent="danger" style={{ marginBottom: 16 }}>{error}</Callout>}
        {loading ? <Spinner /> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {teams.map(team => (
              <li key={team.id || team._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>{team.name}</span>
                <Button intent="text" />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default TeamLeadTeamsPage;
