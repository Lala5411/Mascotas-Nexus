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

    public Solicitud crearSolicitud(Solicitud solicitud) {
        solicitud.setEstado("PENDIENTE");
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