import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login form when there is no active session', () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Inicia sesión' })).toBeInTheDocument();
  expect(screen.getAllByText('Mascota Nexus')).toHaveLength(2);
  expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
});
