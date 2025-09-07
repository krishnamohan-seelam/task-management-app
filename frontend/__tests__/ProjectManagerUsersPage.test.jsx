import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectManagerUsersPage from '../src/pages/ProjectManagerUsersPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('ProjectManagerUsersPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders user list', async () => {
        api.fetchAllTeamMembers.mockResolvedValueOnce([
            { id: '1', name: 'Alice', role: 'Developer' },
            { id: '2', name: 'Bob', role: 'Tester' },
        ]);
        render(<ProjectManagerUsersPage />);
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });

    it('can create a user', async () => {
        api.createTeamMember.mockResolvedValueOnce({ id: '3', name: 'Charlie', role: 'Designer' });
        api.fetchAllTeamMembers.mockResolvedValueOnce([
            { id: '1', name: 'Alice', role: 'Developer' },
            { id: '2', name: 'Bob', role: 'Tester' },
            { id: '3', name: 'Charlie', role: 'Designer' },
        ]);
        render(<ProjectManagerUsersPage />);
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Charlie' } });
        fireEvent.change(screen.getByPlaceholderText(/Role/i), { target: { value: 'Designer' } });
        fireEvent.click(screen.getByText(/Create User/i));
        await waitFor(() => {
            expect(screen.getByText('Charlie')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.fetchAllTeamMembers.mockRejectedValueOnce(new Error('API Error'));
        render(<ProjectManagerUsersPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch users/i)).toBeInTheDocument();
        });
    });
});
