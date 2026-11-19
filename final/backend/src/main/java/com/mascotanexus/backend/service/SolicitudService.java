package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.SolicitudResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.model.Solicitud;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import com.mascotanexus.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class SolicitudService {

    private static final String PENDIENTE = "PENDIENTE";
    private static final String DISPONIBLE = "DISPONIBLE";
    private static final String APROBADA = "APROBADA";
    private static final String RECHAZADA = "RECHAZADA";

    private final SolicitudRepository solicitudRepository;
    private final MascotaRepository mascotaRepository;
    private final UsuarioRepository usuarioRepository;

    public SolicitudService(
            SolicitudRepository solicitudRepository,
            MascotaRepository mascotaRepository,
            UsuarioRepository usuarioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.mascotaRepository = mascotaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Solicitud crearSolicitud(Solicitud solicitud) {
        if (solicitud == null
                || solicitud.getUsuario() == null
                || solicitud.getUsuario().getId() == null
                || solicitud.getMascota() == null
                || solicitud.getMascota().getId() == null
                || solicitud.getMensaje() == null
                || solicitud.getMensaje().isBlank()
                || solicitud.getMensaje().length() > 2000
                || !esValorPermitido(solicitud.getTipoVivienda(), "APARTAMENTO", "CASA")
                || solicitud.getHorasLibres() == null
                || solicitud.getHorasLibres() < 1
                || solicitud.getHorasLibres() > 12
                || !esValorPermitido(solicitud.getNivelActividad(), "BAJO", "MEDIO", "ALTO")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La solicitud requiere usuario, mascota, mensaje de hasta 2000 caracteres y datos válidos del hogar.");
        }

        Long usuarioId = solicitud.getUsuario().getId();
        Long mascotaId = solicitud.getMascota().getId();
        var usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
        Mascota mascota = mascotaRepository.findById(mascotaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mascota no encontrada."));

        if (!DISPONIBLE.equalsIgnoreCase(mascota.getEstado())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La mascota ya no está disponible.");
        }
        if (solicitudRepository.existsByUsuarioIdAndMascotaIdAndEstado(usuarioId, mascotaId, PENDIENTE)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe una solicitud pendiente para esta mascota.");
        }

        solicitud.setUsuario(usuario);
        solicitud.setMascota(mascota);
        solicitud.setMensaje(solicitud.getMensaje().trim());
        solicitud.setTipoVivienda(solicitud.getTipoVivienda().toUpperCase(Locale.ROOT));
        solicitud.setNivelActividad(solicitud.getNivelActividad().toUpperCase(Locale.ROOT));
        solicitud.setEstado(PENDIENTE);
        return solicitudRepository.save(solicitud);
    }

    private boolean esValorPermitido(String valor, String... valoresPermitidos) {
        if (valor == null) {
            return false;
        }
        for (String permitido : valoresPermitidos) {
            if (permitido.equalsIgnoreCase(valor)) {
                return true;
            }
        }
        return false;
    }

    public List<Solicitud> listarTodas() {
        return solicitudRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponse> listarPorUsuario(Long usuarioId) {
        if (usuarioId == null || !usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
        }
        return solicitudRepository.findByUsuarioId(usuarioId).stream()
                .map(SolicitudResponse::from)
                .toList();
    }

    @Transactional
    public Solicitud cambiarEstado(Long solicitudId, String nuevoEstado) {
        if (nuevoEstado == null
                || !(APROBADA.equalsIgnoreCase(nuevoEstado) || RECHAZADA.equalsIgnoreCase(nuevoEstado))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El estado debe ser APROBADA o RECHAZADA.");
        }

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada."));

        if (!PENDIENTE.equalsIgnoreCase(solicitud.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Solo se pueden revisar solicitudes pendientes.");
        }

        String estadoNormalizado = nuevoEstado.toUpperCase(Locale.ROOT);

        if (APROBADA.equals(estadoNormalizado)) {
            Mascota mascota = solicitud.getMascota();
            if (mascota == null || !DISPONIBLE.equalsIgnoreCase(mascota.getEstado())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "La mascota ya no está disponible.");
            }
            mascota.setEstado("ADOPTADO");
            mascotaRepository.save(mascota);
        }

        solicitud.setEstado(estadoNormalizado);
        return solicitudRepository.save(solicitud);
    }
}