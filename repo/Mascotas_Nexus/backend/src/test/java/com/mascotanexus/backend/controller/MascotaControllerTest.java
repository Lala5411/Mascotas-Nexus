package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.dto.MascotaResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.service.MascotaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

    @Test
    void listadoGeneralConservaSuRespuesta() throws Exception {
        when(mascotaService.listarTodas()).thenReturn(List.of(
                new Mascota(1L, "Luna", "Gato", 2, "ADOPTADO", null)));

        mockMvc().perform(get("/api/mascotas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Luna"))
                .andExpect(jsonPath("$[0].estado").value("ADOPTADO"));

        verify(mascotaService).listarTodas();
    }

    @Test
    void listadoDeDisponiblesConservaSuRespuesta() throws Exception {
        when(mascotaService.listarDisponibles()).thenReturn(List.of(
                new Mascota(2L, "Rocky", "Perro", 4, "DISPONIBLE", null)));

        mockMvc().perform(get("/api/mascotas/disponibles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Rocky"))
                .andExpect(jsonPath("$[0].estado").value("DISPONIBLE"));

        verify(mascotaService).listarDisponibles();
    }

    private MockMvc mockMvc() {
        return MockMvcBuilders.standaloneSetup(mascotaController).build();
    }
}
