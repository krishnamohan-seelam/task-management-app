import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/Home';

describe('Home Page', () => {
    it('renders welcome message', () => {
        render(<Home />);
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
});
