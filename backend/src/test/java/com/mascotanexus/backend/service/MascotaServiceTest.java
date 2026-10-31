package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.MascotaResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MascotaServiceTest {

    private MascotaRepository mascotaRepository;
    private MascotaService mascotaService;

    @BeforeEach
    void setUp() {
        mascotaRepository = mock(MascotaRepository.class);
        mascotaService = new MascotaService(mascotaRepository);
    }

    @Test
    void filtrarDisponiblesNormalizaEspecieYMapeaMascotaAResponse() {
        Mascota mascota = new Mascota(7L, "Luna", "Gato", 2, "DISPONIBLE", "/luna.jpg");
        when(mascotaRepository.filtrarDisponibles("Gato", 4)).thenReturn(List.of(mascota));

        List<MascotaResponse> respuesta = mascotaService.filtrarDisponibles("  Gato  ", 4);

        assertEquals(1, respuesta.size());
        assertEquals(7L, respuesta.get(0).getId());
        assertEquals("Luna", respuesta.get(0).getNombre());
        assertEquals("Gato", respuesta.get(0).getEspecie());
        assertEquals(2, respuesta.get(0).getEdad());
        assertEquals("DISPONIBLE", respuesta.get(0).getEstado());
        assertEquals("/luna.jpg", respuesta.get(0).getImagenUrl());
        verify(mascotaRepository).filtrarDisponibles("Gato", 4);
    }

    @Test
    void filtrarDisponiblesIgnoraEspecieVacia() {
        when(mascotaRepository.filtrarDisponibles(null, null)).thenReturn(List.of());

        List<MascotaResponse> respuesta = mascotaService.filtrarDisponibles("   ", null);

        assertEquals(List.of(), respuesta);
        verify(mascotaRepository).filtrarDisponibles(null, null);
    }

    @Test
    void filtrarDisponiblesPermiteSoloEdadMaxima() {
        when(mascotaRepository.filtrarDisponibles(null, 5)).thenReturn(List.of());

        mascotaService.filtrarDisponibles(null, 5);

        verify(mascotaRepository).filtrarDisponibles(null, 5);
    }
}
