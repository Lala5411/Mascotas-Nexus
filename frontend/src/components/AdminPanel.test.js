import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AdminPanel from './AdminPanel';

jest.mock('axios');

beforeEach(() => {
  localStorage.setItem('nombre', 'Admin');
  axios.get.mockResolvedValue({ data: [] });
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const completarFormulario = () => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Nombre de la mascota' }), {
    target: { value: 'Luna' }
  });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Edad de la mascota' }), {
    target: { value: '45' }
  });
};

test('muestra las reglas y conserva los datos si el servidor rechaza la mascota', async () => {
  axios.post.mockRejectedValue({ response: { status: 400 } });
  render(<AdminPanel />);

  completarFormulario();
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Mascota' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'No se pudo registrar la mascota. Revisa que el nombre tenga entre 1 y 60 caracteres, la especie no esté vacía y la edad sea un número entero entre 0 y 30.'
  );
  expect(screen.getByRole('textbox', { name: 'Nombre de la mascota' })).toHaveValue('Luna');
  expect(screen.getByRole('spinbutton', { name: 'Edad de la mascota' })).toHaveValue(45);
});

test('limpia el formulario y recarga la lista si la mascota se registra', async () => {
  axios.post.mockResolvedValue({ data: { id: 9 } });
  render(<AdminPanel />);
  await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/mascotas'));
  const llamadasAntes = axios.get.mock.calls.length;

  completarFormulario();
  fireEvent.click(screen.getByRole('button', { name: 'Guardar Mascota' }));

  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Nombre de la mascota' })).toHaveValue(''));
  expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/mascotas', expect.objectContaining({
    nombre: 'Luna',
    especie: 'Perro',
    edad: 45
  }));
  expect(axios.get.mock.calls.length).toBeGreaterThan(llamadasAntes);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
