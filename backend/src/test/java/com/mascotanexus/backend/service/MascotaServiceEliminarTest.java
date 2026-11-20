package com.mascotanexus.backend.service;

import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MascotaServiceEliminarTest {

    private MascotaRepository mascotaRepository;
    private SolicitudRepository solicitudRepository;
    private MascotaService mascotaService;

    @BeforeEach
    void setUp() {
        mascotaRepository = mock(MascotaRepository.class);
        solicitudRepository = mock(SolicitudRepository.class);
        mascotaService = new MascotaService(mascotaRepository, solicitudRepository);
    }

    @Test
    void eliminarMascotaInexistenteDevuelveNoEncontrado() {
        when(mascotaRepository.existsById(404L)).thenReturn(false);

        assertEstado(HttpStatus.NOT_FOUND, 404L);
    }

    @Test
    void eliminarMascotaConSolicitudPendienteDevuelveConflicto() {
        when(mascotaRepository.existsById(7L)).thenReturn(true);
        when(solicitudRepository.existsByMascotaIdAndEstado(7L, "PENDIENTE")).thenReturn(true);

        assertEstado(HttpStatus.CONFLICT, 7L);
    }

    @Test
    void eliminarMascotaSoloConSolicitudesResueltasDevuelveConflicto() {
        when(mascotaRepository.existsById(7L)).thenReturn(true);
        when(solicitudRepository.existsByMascotaIdAndEstado(7L, "PENDIENTE")).thenReturn(false);
        when(solicitudRepository.existsByMascotaId(7L)).thenReturn(true);

        assertEstado(HttpStatus.CONFLICT, 7L);
    }

    @Test
    void eliminarMascotaSinSolicitudesLaElimina() {
        when(mascotaRepository.existsById(7L)).thenReturn(true);

        mascotaService.eliminar(7L);

        verify(mascotaRepository).deleteById(7L);
    }

    private void assertEstado(HttpStatus esperado, Long mascotaId) {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> mascotaService.eliminar(mascotaId));

        assertEquals(esperado, exception.getStatusCode());
        verify(mascotaRepository, never()).deleteById(any());
    }
}
