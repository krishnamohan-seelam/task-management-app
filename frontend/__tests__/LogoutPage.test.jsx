import React from 'react';
import { render, screen } from '@testing-library/react';
import LogoutPage from '../src/pages/LogoutPage';
import LoginPage from '../src/pages/LoginPage';
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

describe('LogoutPage', () => {
    it('renders logout message', () => {
        renderWithProviders(<LogoutPage />)
        expect(screen.getByText(/Logging out/i)).toBeInTheDocument();
    });
});
