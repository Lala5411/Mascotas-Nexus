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

class SolicitudServiceValidationTest {

    private SolicitudRepository solicitudRepository;
    private MascotaRepository mascotaRepository;
    private UsuarioRepository usuarioRepository;
    private SolicitudService solicitudService;
    private Usuario usuario;
    private Mascota mascota;

    @BeforeEach
    void setUp() {
        solicitudRepository = mock(SolicitudRepository.class);
        mascotaRepository = mock(MascotaRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        solicitudService = new SolicitudService(solicitudRepository, mascotaRepository, usuarioRepository);
        usuario = new Usuario(3L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        mascota = new Mascota(7L, "Luna", "Gato", 2, "DISPONIBLE", null);
    }

    @Test
    void crearSolicitudVinculaRegistrosExistentesYNormalizaElMensaje() {
        Solicitud solicitud = solicitudValida("  Quiero adoptar  ");
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario));
        when(mascotaRepository.findById(7L)).thenReturn(Optional.of(mascota));
        when(solicitudRepository.existsByUsuarioIdAndMascotaIdAndEstado(3L, 7L, "PENDIENTE"))
                .thenReturn(false);
        when(solicitudRepository.save(solicitud)).thenReturn(solicitud);

        Solicitud resultado = solicitudService.crearSolicitud(solicitud);

        assertEquals(usuario, resultado.getUsuario());
        assertEquals(mascota, resultado.getMascota());
        assertEquals("Quiero adoptar", resultado.getMensaje());
        assertEquals("CASA", resultado.getTipoVivienda());
        assertEquals(6, resultado.getHorasLibres());
        assertEquals("ALTO", resultado.getNivelActividad());
        assertEquals("PENDIENTE", resultado.getEstado());
        verify(solicitudRepository).save(solicitud);
    }

    @Test
    void crearSolicitudRechazaMensajeVacioSinGuardar() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> solicitudService.crearSolicitud(solicitudValida("  ")));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void crearSolicitudRechazaUnMensajeDemasiadoLargoSinGuardar() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> solicitudService.crearSolicitud(solicitudValida("a".repeat(2001))));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void crearSolicitudRechazaDatosDeHogarInvalidosSinGuardar() {
        Solicitud solicitud = solicitudValida("Quiero adoptar");
        solicitud.setHorasLibres(13);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> solicitudService.crearSolicitud(solicitud));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(usuarioRepository, never()).findById(3L);
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void crearSolicitudRechazaUnaMascotaNoDisponible() {
        mascota.setEstado("ADOPTADO");
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario));
        when(mascotaRepository.findById(7L)).thenReturn(Optional.of(mascota));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> solicitudService.crearSolicitud(solicitudValida("Quiero adoptar")));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void crearSolicitudRechazaUnaSolicitudPendienteDuplicada() {
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(usuario));
        when(mascotaRepository.findById(7L)).thenReturn(Optional.of(mascota));
        when(solicitudRepository.existsByUsuarioIdAndMascotaIdAndEstado(3L, 7L, "PENDIENTE"))
                .thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> solicitudService.crearSolicitud(solicitudValida("Quiero adoptar")));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(solicitudRepository, never()).save(any());
    }

    @Test
    void crearSolicitudRechazaUnUsuarioInexistente() {
        when(usuarioRepository.findById(3L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> solicitudService.crearSolicitud(solicitudValida("Quiero adoptar")));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(mascotaRepository, never()).findById(7L);
    }

    private Solicitud solicitudValida(String mensaje) {
        Solicitud solicitud = new Solicitud(
                null,
                new Usuario(3L, null, null, null, null),
                new Mascota(7L, null, null, null, null, null),
                mensaje,
                null);
        solicitud.setTipoVivienda("casa");
        solicitud.setHorasLibres(6);
        solicitud.setNivelActividad("alto");
        return solicitud;
    }
}
