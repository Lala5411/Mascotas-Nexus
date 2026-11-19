package com.mascotanexus.backend.service;

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

class SolicitudServiceStateTest {

    private SolicitudRepository solicitudRepository;
    private MascotaRepository mascotaRepository;
    private SolicitudService solicitudService;
    private Mascota mascota;

    @BeforeEach
    void setUp() {
        solicitudRepository = mock(SolicitudRepository.class);
        mascotaRepository = mock(MascotaRepository.class);
        solicitudService = new SolicitudService(
                solicitudRepository, mascotaRepository, mock(UsuarioRepository.class));
        mascota = new Mascota(7L, "Luna", "Gato", 2, "DISPONIBLE", null);
    }

    @Test
    void aprobarSolicitudPendienteAdoptaMascotaEnLaMismaTransaccion() {
        Solicitud solicitud = solicitudPendiente();
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(solicitud)).thenReturn(solicitud);

        Solicitud resultado = solicitudService.cambiarEstado(5L, "aprobada");

        assertEquals("APROBADA", resultado.getEstado());
        assertEquals("ADOPTADO", mascota.getEstado());
        verify(mascotaRepository).save(mascota);
        verify(solicitudRepository).save(solicitud);
    }

    @Test
    void rechazarSolicitudPendienteNoCambiaLaDisponibilidadDeLaMascota() {
        Solicitud solicitud = solicitudPendiente();
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(solicitud)).thenReturn(solicitud);

        Solicitud resultado = solicitudService.cambiarEstado(5L, "rechazada");

        assertEquals("RECHAZADA", resultado.getEstado());
        assertEquals("DISPONIBLE", mascota.getEstado());
        verify(mascotaRepository, never()).save(any());
    }

    @Test
    void cambiarEstadoRechazaValoresFueraDeLasDecisionesPermitidas() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class, () -> solicitudService.cambiarEstado(5L, "PENDIENTE"));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(solicitudRepository, never()).findById(5L);
    }

    @Test
    void cambiarEstadoNoPermiteProcesarUnaSolicitudDosVeces() {
        Solicitud solicitud = solicitudPendiente();
        solicitud.setEstado("RECHAZADA");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class, () -> solicitudService.cambiarEstado(5L, "APROBADA"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void cambiarEstadoNoApruebaUnaMascotaAdoptada() {
        mascota.setEstado("ADOPTADO");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitudPendiente()));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class, () -> solicitudService.cambiarEstado(5L, "APROBADA"));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    private Solicitud solicitudPendiente() {
        Usuario usuario = new Usuario(3L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        return new Solicitud(5L, usuario, mascota, "Quiero adoptar", "PENDIENTE");
    }
}
