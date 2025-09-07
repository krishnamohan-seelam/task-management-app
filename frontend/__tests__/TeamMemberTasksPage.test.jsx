import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamMemberTasksPage from '../src/pages/TeamMemberTasksPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('TeamMemberTasksPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders team member tasks', async () => {
        api.getTasksTM.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'TM Task 1', status: 'pending' },
                { id: '2', title: 'TM Task 2', status: 'completed' },
            ]
        });
        render(<TeamMemberTasksPage />);
        await waitFor(() => {
            expect(screen.getByText('TM Task 1')).toBeInTheDocument();
            expect(screen.getByText('TM Task 2')).toBeInTheDocument();
        });
    });

    it('can mark a task complete', async () => {
        api.updateTaskTM.mockResolvedValueOnce({});
        api.getTasksTM.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'TM Task 1', status: 'completed' },
            ]
        });
        render(<TeamMemberTasksPage />);
        fireEvent.click(screen.getByText(/Mark Complete/i));
        await waitFor(() => {
            expect(screen.getByText(/completed/i)).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getTasksTM.mockRejectedValueOnce(new Error('API Error'));
        render(<TeamMemberTasksPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
