import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MatchMascotas from './MatchMascotas';

jest.mock('axios');

const recomendaciones = [
  {
    mascota: { id: 1, nombre: 'Luna', especie: 'Gato', imagenUrl: null },
    porcentajeCompatibilidad: 70,
    justificacion: 'Los gatos suelen adaptarse bien a espacios interiores.'
  },
  {
    mascota: { id: 2, nombre: 'Rocky', especie: 'Perro', imagenUrl: null },
    porcentajeCompatibilidad: 35,
    justificacion: 'Una mascota joven puede requerir más tiempo.'
  }
];

afterEach(() => {
  jest.clearAllMocks();
});

test('ordena las mascotas con las respuestas visibles y no envía criterios ocultos', async () => {
  axios.post.mockResolvedValue({ data: recomendaciones });
  render(<MatchMascotas />);

  fireEvent.change(screen.getByLabelText('Tipo de Vivienda'), {
    target: { value: 'CASA' }
  });
  fireEvent.change(screen.getByLabelText('Horas libres/día'), {
    target: { value: '6' }
  });
  fireEvent.change(screen.getByLabelText('Ritmo de Vida'), {
    target: { value: 'ALTO' }
  });
  fireEvent.click(screen.getByRole('button', { name: '✨ Recomendarme mascotas' }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    'http://localhost:8080/api/match',
    { tipoVivienda: 'CASA', horasLibres: 6, nivelActividad: 'ALTO' }
  ));
  expect(screen.queryByLabelText(/niños/i)).not.toBeInTheDocument();
  expect(await screen.findByText('70% de afinidad estimada')).toBeInTheDocument();
  expect(screen.getByText('Luna')).toBeInTheDocument();
  expect(screen.getByText('Rocky')).toBeInTheDocument();
  expect(screen.getByText(/no descartamos ninguna/i)).toBeInTheDocument();
});

test('presenta un estado vacío cuando no hay mascotas disponibles', async () => {
  axios.post.mockResolvedValue({ data: [] });
  render(<MatchMascotas />);
  fireEvent.click(screen.getByRole('button', { name: '✨ Recomendarme mascotas' }));

  expect(await screen.findByText('No hay mascotas disponibles en este momento.')).toHaveAttribute(
    'role',
    'status'
  );
});

test('presenta un error accesible y permite reintentar', async () => {
  axios.post.mockRejectedValueOnce(new Error('Network error'));
  render(<MatchMascotas />);
  fireEvent.click(screen.getByRole('button', { name: '✨ Recomendarme mascotas' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'No fue posible calcular las recomendaciones. Inténtalo de nuevo.'
  );
});
