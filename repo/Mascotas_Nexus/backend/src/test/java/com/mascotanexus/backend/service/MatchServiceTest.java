package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.MatchRequest;
import com.mascotanexus.backend.dto.MatchResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MatchServiceTest {

    private MascotaRepository mascotaRepository;
    private MatchService matchService;

    @BeforeEach
    void setUp() {
        mascotaRepository = mock(MascotaRepository.class);
        matchService = new MatchService(mascotaRepository);
    }

    @Test
    void recomiendaTodasLasMascotasDisponiblesSegunLosDatosIngresados() {
        Mascota perroJoven = new Mascota(2L, "Rocky", "Perro", 1, "DISPONIBLE", null);
        Mascota gatoAdulto = new Mascota(1L, "Luna", "Gato", 5, "DISPONIBLE", null);
        when(mascotaRepository.findByEstado("DISPONIBLE")).thenReturn(List.of(perroJoven, gatoAdulto));
        MatchRequest request = request("APARTAMENTO", 2, "BAJO");

        List<MatchResponse> resultados = matchService.calcularCompatibilidad(request);

        assertEquals(2, resultados.size());
        assertEquals("Luna", resultados.get(0).getMascota().getNombre());
        assertEquals(80, resultados.get(0).getPorcentajeCompatibilidad());
        assertTrue(resultados.get(0).getJustificacion().contains("espacios interiores"));
        assertTrue(resultados.get(0).getJustificacion().contains("rutina más tranquila"));
        assertEquals(35, resultados.get(1).getPorcentajeCompatibilidad());
        assertTrue(resultados.get(1).getJustificacion().contains("más tiempo de adaptación"));
        verify(mascotaRepository).findByEstado("DISPONIBLE");
    }

    @Test
    void combinaViviendaTiempoYActividadSinDescartarOtrasEspecies() {
        Mascota perroJoven = new Mascota(2L, "Rocky", "Perro", 1, "DISPONIBLE", null);
        Mascota gatoJoven = new Mascota(1L, "Luna", "Gato", 1, "DISPONIBLE", null);
        when(mascotaRepository.findByEstado("DISPONIBLE")).thenReturn(List.of(gatoJoven, perroJoven));

        List<MatchResponse> resultados = matchService.calcularCompatibilidad(
                request("CASA", 8, "ALTO"));

        assertEquals(2, resultados.size());
        assertEquals("Rocky", resultados.get(0).getMascota().getNombre());
        assertEquals(100, resultados.get(0).getPorcentajeCompatibilidad());
        assertEquals(65, resultados.get(1).getPorcentajeCompatibilidad());
    }

    @Test
    void rechazaRespuestasFueraDeLosControlesDelAsistente() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> matchService.calcularCompatibilidad(request("APARTAMENTO", 13, "MEDIO")));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    private MatchRequest request(String vivienda, Integer horas, String actividad) {
        MatchRequest request = new MatchRequest();
        request.setTipoVivienda(vivienda);
        request.setHorasLibres(horas);
        request.setNivelActividad(actividad);
        return request;
    }
}
