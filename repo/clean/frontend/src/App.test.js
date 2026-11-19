import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login form when there is no active session', () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByText(/Mascota Nexus - Iniciar Sesión/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
});
