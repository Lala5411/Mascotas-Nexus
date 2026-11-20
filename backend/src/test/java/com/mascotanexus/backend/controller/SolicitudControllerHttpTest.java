package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.model.Solicitud;
import com.mascotanexus.backend.model.Usuario;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import com.mascotanexus.backend.repository.UsuarioRepository;
import com.mascotanexus.backend.service.SolicitudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SolicitudControllerHttpTest {

    private SolicitudRepository solicitudRepository;
    private MascotaRepository mascotaRepository;
    private UsuarioRepository usuarioRepository;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        solicitudRepository = mock(SolicitudRepository.class);
        mascotaRepository = mock(MascotaRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        SolicitudService solicitudService = new SolicitudService(
                solicitudRepository, mascotaRepository, usuarioRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(new SolicitudController(solicitudService)).build();
    }

    @Test
    void historialDevuelveNotFoundCuandoElUsuarioNoExiste() throws Exception {
        when(usuarioRepository.existsById(404L)).thenReturn(false);

        mockMvc.perform(get("/api/solicitudes/usuario/404"))
                .andExpect(status().isNotFound());
    }

    @Test
    void historialDevuelveListaVaciaCuandoElUsuarioNoTienePostulaciones() throws Exception {
        when(usuarioRepository.existsById(3L)).thenReturn(true);
        when(solicitudRepository.findByUsuarioId(3L)).thenReturn(List.of());

        mockMvc.perform(get("/api/solicitudes/usuario/3"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void crearSolicitudDevuelveNotFoundCuandoLaMascotaNoExiste() throws Exception {
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(
                new Usuario(3L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER")));
        when(mascotaRepository.findById(7L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/solicitudes")
                        .contentType("application/json")
                        .content(solicitudJson(
                                "\"mensaje\":\"Quiero adoptar\","
                                        + "\"tipoVivienda\":\"CASA\","
                                        + "\"horasLibres\":6,"
                                        + "\"nivelActividad\":\"ALTO\"")))
                .andExpect(status().isNotFound());
    }

    @Test
    void crearSolicitudDevuelveBadRequestCuandoFaltanDatosDelHogar() throws Exception {
        mockMvc.perform(post("/api/solicitudes")
                        .contentType("application/json")
                        .content(solicitudJson(
                                "\"mensaje\":\"Quiero adoptar\","
                                        + "\"tipoVivienda\":\"CASA\","
                                        + "\"horasLibres\":6")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cambiarEstadoDevuelveNotFoundCuandoLaSolicitudNoExiste() throws Exception {
        when(solicitudRepository.findById(404L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/solicitudes/404/estado").param("estado", "APROBADA"))
                .andExpect(status().isNotFound());
    }

    @Test
    void cancelarDevuelveLaSolicitudCanceladaCuandoEsDelUsuarioYEstaPendiente() throws Exception {
        Solicitud solicitud = solicitudPendienteDelUsuario3();
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        mockMvc.perform(put("/api/solicitudes/5/cancelar").param("usuarioId", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("CANCELADA"))
                .andExpect(jsonPath("$.mascotaNombre").value("Luna"));
    }

    @Test
    void cancelarDevuelveForbiddenCuandoLaSolicitudEsDeOtroUsuario() throws Exception {
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitudPendienteDelUsuario3()));

        mockMvc.perform(put("/api/solicitudes/5/cancelar").param("usuarioId", "9"))
                .andExpect(status().isForbidden());
    }

    @Test
    void cancelarDevuelveConflictCuandoLaSolicitudYaNoEstaPendiente() throws Exception {
        Solicitud solicitud = solicitudPendienteDelUsuario3();
        solicitud.setEstado("RECHAZADA");
        when(solicitudRepository.findById(5L)).thenReturn(Optional.of(solicitud));

        mockMvc.perform(put("/api/solicitudes/5/cancelar").param("usuarioId", "3"))
                .andExpect(status().isConflict());
    }

    @Test
    void resumenDevuelveElConteoPorEstado() throws Exception {
        when(solicitudRepository.countByEstado("PENDIENTE")).thenReturn(3L);
        when(solicitudRepository.countByEstado("APROBADA")).thenReturn(1L);
        when(solicitudRepository.countByEstado("RECHAZADA")).thenReturn(2L);
        when(solicitudRepository.countByEstado("CANCELADA")).thenReturn(0L);

        mockMvc.perform(get("/api/solicitudes/resumen"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pendientes").value(3))
                .andExpect(jsonPath("$.aprobadas").value(1))
                .andExpect(jsonPath("$.rechazadas").value(2))
                .andExpect(jsonPath("$.canceladas").value(0))
                .andExpect(jsonPath("$.total").value(6));
    }

    private Solicitud solicitudPendienteDelUsuario3() {
        Usuario usuario = new Usuario(3L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        Mascota mascota = new Mascota(7L, "Luna", "Gato", 2, "DISPONIBLE", null);
        return new Solicitud(5L, usuario, mascota, "Quiero adoptar", "PENDIENTE");
    }

    private String solicitudJson(String campos) {
        return "{\"usuario\":{\"id\":3},\"mascota\":{\"id\":7}," + campos + "}";
    }
}
