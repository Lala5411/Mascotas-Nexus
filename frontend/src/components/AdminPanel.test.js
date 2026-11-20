import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import AdminPanel from './AdminPanel';

jest.mock('axios');

const resumenInicial = { pendientes: 3, aprobadas: 1, rechazadas: 2, canceladas: 0, total: 6 };

const simularGet = ({ solicitudes = [], resumen = Promise.resolve({ data: resumenInicial }) } = {}) => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/solicitudes/resumen')) {
      return resumen;
    }
    if (url.endsWith('/solicitudes')) {
      return Promise.resolve({ data: solicitudes });
    }
    return Promise.resolve({ data: [] });
  });
};

const llamadasAlResumen = () => axios.get.mock.calls
  .filter(([url]) => url.endsWith('/solicitudes/resumen')).length;

beforeEach(() => {
  localStorage.setItem('nombre', 'Admin');
  simularGet();
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

test('muestra el resumen de solicitudes por estado', async () => {
  render(<AdminPanel />);

  const resumen = await screen.findByRole('region', { name: 'Resumen de solicitudes' });
  expect(await within(resumen).findByText('Pendientes: 3')).toBeInTheDocument();
  expect(within(resumen).getByText('Aprobadas: 1')).toBeInTheDocument();
  expect(within(resumen).getByText('Rechazadas: 2')).toBeInTheDocument();
  expect(within(resumen).getByText('Canceladas: 0')).toBeInTheDocument();
  expect(within(resumen).getByText('Total: 6')).toBeInTheDocument();
});

test('muestra un error si no se puede cargar el resumen', async () => {
  simularGet({ resumen: Promise.reject(new Error('sin conexión')) });
  render(<AdminPanel />);

  expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible cargar el resumen de solicitudes.');
});

test('vuelve a cargar el resumen después de aprobar una solicitud', async () => {
  simularGet({
    solicitudes: [{
      id: 41,
      estado: 'PENDIENTE',
      mensaje: 'Quiero adoptar',
      mascota: { nombre: 'Luna' },
      usuario: { nombre: 'Adoptante' }
    }]
  });
  axios.put.mockResolvedValue({ data: {} });
  render(<AdminPanel />);
  await screen.findByText('Pendientes: 3');
  const llamadasAntes = llamadasAlResumen();

  fireEvent.click(await screen.findByRole('button', { name: 'Aprobar' }));

  await waitFor(() => expect(llamadasAlResumen()).toBeGreaterThan(llamadasAntes));
  expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/api/solicitudes/41/estado?estado=APROBADA');
});
