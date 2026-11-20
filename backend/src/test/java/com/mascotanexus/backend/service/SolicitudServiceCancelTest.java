package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.SolicitudResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.model.Solicitud;
import com.mascotanexus.backend.model.Usuario;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import com.mascotanexus.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SolicitudServiceCancelTest {

    private SolicitudRepository solicitudRepository;
    private SolicitudService solicitudService;
    private Usuario adoptante;
    private Mascota mascota;

    @BeforeEach
    void setUp() {
        solicitudRepository = mock(SolicitudRepository.class);
        solicitudService = new SolicitudService(
                solicitudRepository, mock(MascotaRepository.class), mock(UsuarioRepository.class));
        adoptante = new Usuario(3L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        mascota = new Mascota(7L, "Luna", "Gato", 2, "DISPONIBLE", null);
    }

    @Test
    void cancelarSolicitudPendientePropiaLaDejaCancelada() {
        Solicitud solicitud = solicitudConEstado("PENDIENTE");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(solicitud)).thenReturn(solicitud);

        SolicitudResponse respuesta = solicitudService.cancelar(5L, 3L);

        assertEquals("CANCELADA", respuesta.getEstado());
        assertEquals("CANCELADA", solicitud.getEstado());
        assertEquals("DISPONIBLE", mascota.getEstado());
        verify(solicitudRepository).save(solicitud);
    }

    @Test
    void cambiarEstadoDeUnaSolicitudCanceladaDevuelveConflicto() {
        Solicitud solicitud = solicitudConEstado("CANCELADA");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> solicitudService.cambiarEstado(5L, "APROBADA"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void cancelarSolicitudInexistenteDevuelveNoEncontrado() {
        when(solicitudRepository.findById(404L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> solicitudService.cancelar(404L, 3L));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void cancelarSolicitudDeOtroUsuarioDevuelveProhibido() {
        Solicitud solicitud = solicitudConEstado("PENDIENTE");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> solicitudService.cancelar(5L, 9L));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertEquals("PENDIENTE", solicitud.getEstado());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void cancelarSolicitudQueYaNoEstaPendienteDevuelveConflicto() {
        Solicitud solicitud = solicitudConEstado("APROBADA");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> solicitudService.cancelar(5L, 3L));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("APROBADA", solicitud.getEstado());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void cancelarSinIdentificarAlUsuarioDevuelveSolicitudIncorrecta() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> solicitudService.cancelar(5L, null));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(solicitudRepository, never()).findById(any());
        verify(solicitudRepository, never()).save(any());
    }

    private Solicitud solicitudConEstado(String estado) {
        Solicitud solicitud = new Solicitud(5L, adoptante, mascota, "Quiero adoptar", estado);
        solicitud.setTipoVivienda("CASA");
        solicitud.setHorasLibres(6);
        solicitud.setNivelActividad("ALTO");
        return solicitud;
    }
}
