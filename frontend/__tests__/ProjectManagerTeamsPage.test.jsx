import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectManagerTeamsPage from '../src/pages/ProjectManagerTeamsPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('ProjectManagerTeamsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders teams list', async () => {
        api.fetchTeams.mockResolvedValueOnce([
            { id: '1', name: 'Alpha Team' },
            { id: '2', name: 'Beta Team' },
        ]);
        render(<ProjectManagerTeamsPage />);
        await waitFor(() => {
            expect(screen.getByText('Alpha Team')).toBeInTheDocument();
            expect(screen.getByText('Beta Team')).toBeInTheDocument();
        });
    });

    it('can create a team', async () => {
        api.createTeam.mockResolvedValueOnce({ id: '3', name: 'Gamma Team' });
        api.fetchTeams.mockResolvedValueOnce([
            { id: '1', name: 'Alpha Team' },
            { id: '2', name: 'Beta Team' },
            { id: '3', name: 'Gamma Team' },
        ]);
        render(<ProjectManagerTeamsPage />);
        fireEvent.change(screen.getByPlaceholderText(/Team Name/i), { target: { value: 'Gamma Team' } });
        fireEvent.click(screen.getByText(/Create Team/i));
        await waitFor(() => {
            expect(screen.getByText('Gamma Team')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.fetchTeams.mockRejectedValueOnce(new Error('API Error'));
        render(<ProjectManagerTeamsPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch teams/i)).toBeInTheDocument();
        });
    });
});
