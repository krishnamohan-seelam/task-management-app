import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../src/pages/Profile';
import userReducer from '../src//userSlice';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            user: userReducer,
            // Add other reducers if needed
        },
        preloadedState,
    });
};

// Helper function to render with providers
const renderWithProviders = (component, { store = createTestStore(), ...renderOptions } = {}) => {
    return render(
        <Provider store={store}>
            <MemoryRouter future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}>
                {component}
            </MemoryRouter>
        </Provider>,
        renderOptions
    );
};
describe('Profile Page', () => {
    it('renders profile header', () => {
        renderWithProviders(<Profile />)
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });
});
