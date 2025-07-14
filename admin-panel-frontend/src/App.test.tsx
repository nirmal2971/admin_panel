import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// ✅ Mock react-router-dom to prevent runtime failures
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: () => <div>Mocked Route</div>,
  Navigate: () => <div>Mocked Navigate</div>,
}));

test('renders login page', () => {
  render(<App />);
  // Change this based on actual visible text in your app, e.g., Login
  const loginText = screen.getByText(/login/i);
  expect(loginText).toBeInTheDocument();
});
