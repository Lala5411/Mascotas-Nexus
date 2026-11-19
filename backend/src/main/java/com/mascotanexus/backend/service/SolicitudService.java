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

@Service
public class SolicitudService {

    private static final String PENDIENTE = "PENDIENTE";
    private static final String DISPONIBLE = "DISPONIBLE";

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
                || solicitud.getMensaje().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La solicitud requiere usuario, mascota y mensaje.");
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
        solicitud.setEstado(PENDIENTE);
        return solicitudRepository.save(solicitud);
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

    public Solicitud cambiarEstado(Long solicitudId, String nuevoEstado) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado(nuevoEstado);
        if ("APROBADA".equalsIgnoreCase(nuevoEstado)) {
            Mascota mascota = solicitud.getMascota();
            mascota.setEstado("ADOPTADO");
            mascotaRepository.save(mascota);
        }

        return solicitudRepository.save(solicitud);
    }
}