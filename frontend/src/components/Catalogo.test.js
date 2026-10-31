import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Catalogo from './Catalogo';

jest.mock('axios');
jest.mock('./MatchMascotas', () => () => null);

const mascotasIniciales = [
  { id: 1, nombre: 'Luna', especie: 'Gato', edad: 2, estado: 'DISPONIBLE' },
  { id: 2, nombre: 'Nube', especie: 'Gato', edad: 1, estado: 'DISPONIBLE' },
  { id: 3, nombre: 'Rocky', especie: 'Perro', edad: 4, estado: 'DISPONIBLE' }
];

const configurarRespuestasIniciales = () => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    if (url.endsWith('/solicitudes')) {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: [] });
  });
};

beforeEach(() => {
  localStorage.setItem('nombre', 'Adoptante');
  configurarRespuestasIniciales();
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test('muestra la búsqueda y especies únicas cargadas del catálogo', async () => {
  render(<Catalogo />);

  expect(screen.getByRole('searchbox', { name: 'Buscar por nombre' })).toBeInTheDocument();
  const selector = screen.getByRole('combobox', { name: 'Filtrar por especie' });
  expect(await screen.findByRole('option', { name: 'Gato' })).toBeInTheDocument();
  expect(screen.getAllByRole('option', { name: 'Gato' })).toHaveLength(1);
  expect(selector).toHaveDisplayValue('Todas las especies');
  expect(await screen.findByText('Rocky')).toBeInTheDocument();
});

test('busca nombres en tiempo real sin distinguir mayúsculas', async () => {
  render(<Catalogo />);
  await screen.findByText('Rocky');

  fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar por nombre' }), {
    target: { value: 'lUnA' }
  });

  expect(screen.getByText('Luna')).toBeInTheDocument();
  expect(screen.queryByText('Nube')).not.toBeInTheDocument();
  expect(screen.queryByText('Rocky')).not.toBeInTheDocument();
});

test('combina la búsqueda por nombre con el filtro de especie del backend', async () => {
  const gatosFiltrados = mascotasIniciales.filter((mascota) => mascota.especie === 'Gato');
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    if (url.endsWith('/solicitudes')) {
      return Promise.resolve({ data: [] });
    }
    if (url.endsWith('/mascotas/filtrar')) {
      return Promise.resolve({ data: gatosFiltrados });
    }
    return Promise.resolve({ data: [] });
  });

  render(<Catalogo />);
  await screen.findByText('Rocky');
  fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por especie' }), {
    target: { value: 'Gato' }
  });
  await screen.findByText('Nube');

  expect(axios.get).toHaveBeenCalledWith(
    'http://localhost:8080/api/mascotas/filtrar',
    { params: { especie: 'Gato' } }
  );

  fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar por nombre' }), {
    target: { value: 'luna' }
  });

  expect(screen.getByText('Luna')).toBeInTheDocument();
  expect(screen.queryByText('Nube')).not.toBeInTheDocument();
});

test('muestra el estado de carga al solicitar una especie', async () => {
  let resolverFiltro;
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    if (url.endsWith('/solicitudes')) {
      return Promise.resolve({ data: [] });
    }
    if (url.endsWith('/mascotas/filtrar')) {
      return new Promise((resolve) => {
        resolverFiltro = resolve;
      });
    }
    return Promise.resolve({ data: [] });
  });

  render(<Catalogo />);
  await screen.findByText('Rocky');
  fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por especie' }), {
    target: { value: 'Gato' }
  });

  expect(screen.getByRole('status')).toHaveTextContent('Cargando mascotas');
  resolverFiltro({ data: mascotasIniciales.filter((mascota) => mascota.especie === 'Gato') });
  await screen.findByText('Nube');
});

test('ignora resultados de una especie anterior si llega tarde', async () => {
  const resolvers = [];
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    if (url.endsWith('/solicitudes')) {
      return Promise.resolve({ data: [] });
    }
    if (url.endsWith('/mascotas/filtrar')) {
      return new Promise((resolve) => resolvers.push(resolve));
    }
    return Promise.resolve({ data: [] });
  });

  render(<Catalogo />);
  await screen.findByText('Rocky');
  const selector = screen.getByRole('combobox', { name: 'Filtrar por especie' });
  fireEvent.change(selector, { target: { value: 'Gato' } });
  fireEvent.change(selector, { target: { value: 'Perro' } });

  await act(async () => {
    resolvers[1]({ data: [mascotasIniciales[2]] });
  });
  expect(await screen.findByText('Rocky')).toBeInTheDocument();

  await act(async () => {
    resolvers[0]({ data: mascotasIniciales.slice(0, 2) });
  });
  expect(screen.getByText('Rocky')).toBeInTheDocument();
  expect(screen.queryByText('Luna')).not.toBeInTheDocument();
});

test('muestra mensajes de error y de ausencia de coincidencias', async () => {
  render(<Catalogo />);
  await screen.findByText('Rocky');

  fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar por nombre' }), {
    target: { value: 'No existe' }
  });
  expect(screen.getByRole('status')).toHaveTextContent('No se encontraron mascotas');

  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/filtrar')) {
      return Promise.reject(new Error('Network error'));
    }
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    return Promise.resolve({ data: [] });
  });

  fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por especie' }), {
    target: { value: 'Gato' }
  });

  expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible filtrar las mascotas');
});

test('restaura los resultados iniciales al seleccionar todas las especies', async () => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    if (url.endsWith('/solicitudes')) {
      return Promise.resolve({ data: [] });
    }
    if (url.endsWith('/mascotas/filtrar')) {
      return Promise.resolve({ data: mascotasIniciales.filter((mascota) => mascota.especie === 'Gato') });
    }
    return Promise.resolve({ data: [] });
  });

  render(<Catalogo />);
  await screen.findByText('Rocky');
  const selector = screen.getByRole('combobox', { name: 'Filtrar por especie' });
  fireEvent.change(selector, { target: { value: 'Gato' } });
  await waitFor(() => expect(screen.queryByText('Rocky')).not.toBeInTheDocument());
  fireEvent.change(selector, { target: { value: '' } });

  expect(await screen.findByText('Rocky')).toBeInTheDocument();
});
