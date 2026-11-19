package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.dto.SolicitudResponse;
import com.mascotanexus.backend.service.SolicitudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SolicitudControllerTest {

    private SolicitudService solicitudService;
    private SolicitudController solicitudController;

    @BeforeEach
    void setUp() {
        solicitudService = mock(SolicitudService.class);
        solicitudController = new SolicitudController(solicitudService);
    }

    @Test
    void listarSolicitudesPorUsuarioDevuelveSoloElResultadoDelUsuario() {
        List<SolicitudResponse> solicitudes = List.of(
                new SolicitudResponse(8L, 7L, "Luna", "Quiero adoptar", "PENDIENTE"));
        when(solicitudService.listarPorUsuario(3L)).thenReturn(solicitudes);

        ResponseEntity<List<SolicitudResponse>> respuesta = solicitudController.listarSolicitudesPorUsuario(3L);

        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals(solicitudes, respuesta.getBody());
        verify(solicitudService).listarPorUsuario(3L);
    }
}
