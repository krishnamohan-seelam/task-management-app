import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectManagerTeamMembersPage from '../src/pages/ProjectManagerTeamsPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('ProjectManagerTeamMembersPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders team members', async () => {
        api.getTeamMembersPM.mockResolvedValueOnce({
            data: [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' },
            ]
        });
        render(<ProjectManagerTeamMembersPage />);
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getTeamMembersPM.mockRejectedValueOnce(new Error('API Error'));
        render(<ProjectManagerTeamMembersPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch team members/i)).toBeInTheDocument();
        });
    });
});
