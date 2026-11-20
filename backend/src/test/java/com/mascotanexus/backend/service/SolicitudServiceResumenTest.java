package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.ResumenSolicitudesResponse;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import com.mascotanexus.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SolicitudServiceResumenTest {

    private SolicitudRepository solicitudRepository;
    private SolicitudService solicitudService;

    @BeforeEach
    void setUp() {
        solicitudRepository = mock(SolicitudRepository.class);
        solicitudService = new SolicitudService(
                solicitudRepository, mock(MascotaRepository.class), mock(UsuarioRepository.class));
    }

    @Test
    void resumenCuentaLasSolicitudesPorEstadoYElTotal() {
        when(solicitudRepository.countByEstado("PENDIENTE")).thenReturn(3L);
        when(solicitudRepository.countByEstado("APROBADA")).thenReturn(1L);
        when(solicitudRepository.countByEstado("RECHAZADA")).thenReturn(2L);
        when(solicitudRepository.countByEstado("CANCELADA")).thenReturn(0L);

        ResumenSolicitudesResponse resumen = solicitudService.resumenPorEstado();

        assertEquals(new ResumenSolicitudesResponse(3L, 1L, 2L, 0L, 6L), resumen);
    }

    @Test
    void resumenSinSolicitudesDevuelveCeros() {
        ResumenSolicitudesResponse resumen = solicitudService.resumenPorEstado();

        assertEquals(new ResumenSolicitudesResponse(0L, 0L, 0L, 0L, 0L), resumen);
    }
}
