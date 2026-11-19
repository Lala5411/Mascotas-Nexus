import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Catalogo from './Catalogo';

jest.mock('axios');

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
    if (url.endsWith('/solicitudes/usuario/7')) {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: [] });
  });
};

beforeEach(() => {
  localStorage.setItem('nombre', 'Adoptante');
  localStorage.setItem('usuarioId', '7');
  configurarRespuestasIniciales();
  axios.post.mockResolvedValue({ data: {} });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
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

test('muestra mensajes distintos para postulaciones aprobadas y rechazadas', async () => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/mascotas/disponibles')) {
      return Promise.resolve({ data: mascotasIniciales });
    }
    if (url.endsWith('/solicitudes/usuario/7')) {
      return Promise.resolve({
        data: [
          {
            id: 21,
            mascotaNombre: 'Luna',
            mensaje: 'Quiero adoptar',
            estado: 'APROBADA',
            tipoVivienda: 'CASA',
            horasLibres: 6,
            nivelActividad: 'ALTO'
          },
          {
            id: 22,
            mascotaNombre: 'Nube',
            mensaje: 'Me interesa adoptar',
            estado: 'RECHAZADA',
            tipoVivienda: 'APARTAMENTO',
            horasLibres: 3,
            nivelActividad: 'MEDIO'
          }
        ]
      });
    }
    return Promise.resolve({ data: [] });
  });

  render(<Catalogo />);
  await screen.findByText('Rocky');
  fireEvent.click(screen.getByRole('button', { name: /Mis Postulaciones/ }));

  const mensajesEstado = await screen.findAllByRole('status');
  expect(mensajesEstado.map((mensajeEstado) => mensajeEstado.textContent).join(' '))
    .toContain('Tu postulación fue aprobada');
  expect(mensajesEstado.map((mensajeEstado) => mensajeEstado.textContent).join(' '))
    .toContain('puedes seguir buscando y postularte a otras mascotas');
  expect(axios.get).toHaveBeenCalledTimes(3);
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
    if (url.endsWith('/solicitudes/usuario/7')) {
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
    if (url.endsWith('/solicitudes/usuario/7')) {
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
    if (url.endsWith('/solicitudes/usuario/7')) {
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
    if (url.endsWith('/solicitudes/usuario/7')) {
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

test('solicita y persiste el perfil del hogar al postular con el usuario autenticado', async () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  axios.post.mockImplementation((url) => {
    if (url.endsWith('/match')) {
      return Promise.resolve({
        data: [{
          mascota: mascotasIniciales[0],
          porcentajeCompatibilidad: 85,
          justificacion: 'Tu rutina parece compatible.'
        }]
      });
    }
    return Promise.resolve({ data: {} });
  });
  render(<Catalogo />);
  await screen.findByText('Luna');

  fireEvent.click(screen.getAllByRole('button', { name: 'Postularme para Adopción' })[0]);
  fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de vivienda' }), {
    target: { value: 'CASA' }
  });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Horas disponibles al día' }), {
    target: { value: '6' }
  });
  fireEvent.change(screen.getByRole('combobox', { name: 'Ritmo de vida' }), {
    target: { value: 'ALTO' }
  });
  fireEvent.change(screen.getByRole('textbox', {
    name: '¿Por qué quieres adoptar y cómo cuidarás a Luna?'
  }), {
    target: { value: 'Tengo espacio para adoptar.' }
  });

  fireEvent.click(screen.getByRole('button', { name: 'Calcular afinidad' }));
  expect(await screen.findByText('85% de afinidad estimada')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Enviar Postulación' }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    'http://localhost:8080/api/solicitudes',
    {
      usuario: { id: 7 },
      mascota: { id: 1 },
      mensaje: 'Tengo espacio para adoptar.',
      tipoVivienda: 'CASA',
      horasLibres: 6,
      nivelActividad: 'ALTO'
    }
  ));
  expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/match', {
    tipoVivienda: 'CASA',
    horasLibres: 6,
    nivelActividad: 'ALTO'
  });
  expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/solicitudes/usuario/7');
  alertSpy.mockRestore();
});
