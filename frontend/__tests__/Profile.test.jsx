import { render, screen } from '@testing-library/react';
import Profile from '../src/pages/Profile';

describe('Profile Page', () => {
    it('renders profile header', () => {
        render(<Profile />);
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });
});
