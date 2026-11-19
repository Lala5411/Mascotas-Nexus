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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SolicitudServiceTest {

    private SolicitudRepository solicitudRepository;
    private UsuarioRepository usuarioRepository;
    private SolicitudService solicitudService;

    @BeforeEach
    void setUp() {
        solicitudRepository = mock(SolicitudRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        solicitudService = new SolicitudService(
                solicitudRepository, mock(MascotaRepository.class), usuarioRepository);
    }

    @Test
    void listarPorUsuarioDevuelveSolicitudesComoDto() {
        Usuario usuario = new Usuario(3L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        Mascota mascota = new Mascota(7L, "Luna", "Gato", 2, "DISPONIBLE", null);
        Solicitud solicitud = new Solicitud(5L, usuario, mascota, "Quiero adoptar", "PENDIENTE");
        when(usuarioRepository.existsById(3L)).thenReturn(true);
        when(solicitudRepository.findByUsuarioId(3L)).thenReturn(List.of(solicitud));

        assertEquals(
                List.of(new SolicitudResponse(5L, 7L, "Luna", "Quiero adoptar", "PENDIENTE")),
                solicitudService.listarPorUsuario(3L));
        verify(solicitudRepository).findByUsuarioId(3L);
    }
}
