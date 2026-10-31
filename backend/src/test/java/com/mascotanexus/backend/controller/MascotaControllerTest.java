package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.dto.MascotaResponse;
import com.mascotanexus.backend.service.MascotaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class MascotaControllerTest {

    private MascotaService mascotaService;
    private MascotaController mascotaController;

    @BeforeEach
    void setUp() {
        mascotaService = mock(MascotaService.class);
        mascotaController = new MascotaController(mascotaService);
    }

    @Test
    void filtrarMascotasDevuelveListaConEstadoOk() {
        List<MascotaResponse> mascotas = List.of(
                new MascotaResponse(1L, "Luna", "Gato", 2, "DISPONIBLE", null));
        when(mascotaService.filtrarDisponibles("Gato", 4)).thenReturn(mascotas);

        ResponseEntity<List<MascotaResponse>> respuesta =
                mascotaController.filtrarMascotas("Gato", 4);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(mascotas, respuesta.getBody());
        verify(mascotaService).filtrarDisponibles("Gato", 4);
    }

    @Test
    void filtrarMascotasSinParametrosDevuelveListaVaciaConEstadoOk() {
        when(mascotaService.filtrarDisponibles(null, null)).thenReturn(List.of());

        ResponseEntity<List<MascotaResponse>> respuesta =
                mascotaController.filtrarMascotas(null, null);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(List.of(), respuesta.getBody());
    }

    @Test
    void filtrarMascotasDevuelveBadRequestParaEdadNegativa() {
        ResponseEntity<List<MascotaResponse>> respuesta =
                mascotaController.filtrarMascotas(null, -1);

        assertEquals(HttpStatus.BAD_REQUEST, respuesta.getStatusCode());
        verifyNoInteractions(mascotaService);
    }
}
