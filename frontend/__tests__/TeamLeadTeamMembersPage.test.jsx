import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamLeadTeamMembersPage from '../src/pages/TeamLeadTeamsPage';
import * as api from '../src/api';

jest.mock('../src/api');

describe('TeamLeadTeamMembersPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders team lead team members', async () => {
        api.getTeamMembersTL.mockResolvedValueOnce({
            data: [
                { id: '1', name: 'TL Member 1' },
                { id: '2', name: 'TL Member 2' },
            ]
        });
        render(<TeamLeadTeamMembersPage />);
        await waitFor(() => {
            expect(screen.getByText('TL Member 1')).toBeInTheDocument();
            expect(screen.getByText('TL Member 2')).toBeInTheDocument();
        });
    });

    it('shows error on API failure', async () => {
        api.getTeamMembersTL.mockRejectedValueOnce(new Error('API Error'));
        render(<TeamLeadTeamMembersPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch team members/i)).toBeInTheDocument();
        });
    });
});
