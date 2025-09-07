import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/Home';

describe('Home Page', () => {
    it('renders welcome message', () => {
        render(<Home />);
        const welcomeElement = screen.getByText(/welcome/i);
        expect(welcomeElement).toBeInTheDocument();
    });
});
