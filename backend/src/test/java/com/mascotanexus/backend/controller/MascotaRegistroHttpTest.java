package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import com.mascotanexus.backend.service.MascotaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MascotaRegistroHttpTest {

    private MascotaRepository mascotaRepository;
    private SolicitudRepository solicitudRepository;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mascotaRepository = mock(MascotaRepository.class);
        solicitudRepository = mock(SolicitudRepository.class);
        when(mascotaRepository.save(any(Mascota.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
        mockMvc = MockMvcBuilders
                .standaloneSetup(new MascotaController(new MascotaService(mascotaRepository, solicitudRepository)))
                .build();
    }

    @Test
    void eliminarMascotaConSolicitudesPendientesDevuelveConflict() throws Exception {
        when(mascotaRepository.existsById(7L)).thenReturn(true);
        when(solicitudRepository.existsByMascotaIdAndEstado(7L, "PENDIENTE")).thenReturn(true);

        mockMvc.perform(delete("/api/mascotas/7"))
                .andExpect(status().isConflict());

        verify(mascotaRepository, never()).deleteById(any());
    }

    @Test
    void eliminarMascotaSinSolicitudesDevuelveNoContent() throws Exception {
        when(mascotaRepository.existsById(8L)).thenReturn(true);

        mockMvc.perform(delete("/api/mascotas/8"))
                .andExpect(status().isNoContent());

        verify(mascotaRepository).deleteById(8L);
    }

    @Test
    void registrarMascotaConEdadFueraDeRangoDevuelveBadRequest() throws Exception {
        mockMvc.perform(post("/api/mascotas")
                        .contentType("application/json")
                        .content("{\"nombre\":\"Luna\",\"especie\":\"Gato\",\"edad\":45}"))
                .andExpect(status().isBadRequest());

        verify(mascotaRepository, never()).save(any());
    }

    @Test
    void registrarMascotaValidaDevuelveOk() throws Exception {
        mockMvc.perform(post("/api/mascotas")
                        .contentType("application/json")
                        .content("{\"nombre\":\" Luna \",\"especie\":\"Gato\",\"edad\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Luna"))
                .andExpect(jsonPath("$.estado").value("DISPONIBLE"));
    }
}
