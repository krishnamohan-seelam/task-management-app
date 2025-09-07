import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamLeadTasksPage from '../src/pages/TeamLeadTasksPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('TeamLeadTasksPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders team lead tasks', async () => {
        api.getTasksTL.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'TL Task 1', status: 'pending' },
                { id: '2', title: 'TL Task 2', status: 'completed' },
            ]
        });
        render(<TeamLeadTasksPage />);
        await waitFor(() => {
            expect(screen.getByText('TL Task 1')).toBeInTheDocument();
            expect(screen.getByText('TL Task 2')).toBeInTheDocument();
        });
    });

    it('can assign a task', async () => {
        api.assignTaskTL.mockResolvedValueOnce({});
        api.getTasksTL.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'TL Task 1', status: 'pending' },
                { id: '2', title: 'TL Task 2', status: 'completed' },
                { id: '3', title: 'TL Task 3', status: 'pending' },
            ]
        });
        render(<TeamLeadTasksPage />);
        fireEvent.change(screen.getByPlaceholderText(/Task ID/i), { target: { value: '3' } });
        fireEvent.change(screen.getByPlaceholderText(/User ID/i), { target: { value: '5' } });
        fireEvent.click(screen.getByText(/Assign Task/i));
        await waitFor(() => {
            expect(screen.getByText('TL Task 3')).toBeInTheDocument();
        });
    });

    it('can update a task', async () => {
        api.updateTaskTL.mockResolvedValueOnce({});
        api.getTasksTL.mockResolvedValueOnce({
            data: [
                { id: '1', title: 'TL Task 1', status: 'completed' },
            ]
        });
        render(<TeamLeadTasksPage />);
        fireEvent.change(screen.getByPlaceholderText(/Task ID/i), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText(/Status/i), { target: { value: 'completed' } });
        fireEvent.click(screen.getByText(/Update Task/i));
        await waitFor(() => {
            expect(screen.getByText('TL Task 1')).toBeInTheDocument();
            expect(screen.getByText(/completed/i)).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getTasksTL.mockRejectedValueOnce(new Error('API Error'));
        render(<TeamLeadTasksPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
});
