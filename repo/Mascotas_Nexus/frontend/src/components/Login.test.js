import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from './Login';

jest.mock('axios');

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test('guarda el ID del usuario autenticado para las operaciones de adopción', async () => {
  const datosUsuario = {
    token: 'token',
    nombre: 'Adoptante',
    rol: 'ROLE_USER',
    usuarioId: 42
  };
  const onLoginSuccess = jest.fn();
  axios.post.mockResolvedValue({ data: datosUsuario });

  const { container } = render(<Login onLoginSuccess={onLoginSuccess} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'adoptante@example.com' } });
  fireEvent.change(container.querySelector('input[type="password"]'), {
    target: { value: 'password' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

  await waitFor(() => expect(localStorage.getItem('usuarioId')).toBe('42'));
  expect(onLoginSuccess).toHaveBeenCalledWith(datosUsuario);
});

test('expone errores de autenticación con una alerta accesible', async () => {
  axios.post.mockRejectedValue(new Error('Unauthorized'));
  render(<Login onLoginSuccess={jest.fn()} />);

  fireEvent.change(screen.getByLabelText('Email:'), {
    target: { value: 'adoptante@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Contraseña:'), {
    target: { value: 'incorrecta' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Credenciales incorrectas. Intenta de nuevo.'
  );
});
