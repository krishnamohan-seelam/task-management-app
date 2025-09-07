import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamLeadTeamsPage from '../src/pages/TeamLeadTeamsPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('TeamLeadTeamsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders team lead teams', async () => {
        api.getTeamMembersTL.mockResolvedValueOnce({
            data: [
                { id: '1', name: 'TL Team 1' },
                { id: '2', name: 'TL Team 2' },
            ]
        });
        render(<TeamLeadTeamsPage />);
        await waitFor(() => {
            expect(screen.getByText('TL Team 1')).toBeInTheDocument();
            expect(screen.getByText('TL Team 2')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getTeamMembersTL.mockRejectedValueOnce(new Error('API Error'));
        render(<TeamLeadTeamsPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch teams/i)).toBeInTheDocument();
        });
    });
});
