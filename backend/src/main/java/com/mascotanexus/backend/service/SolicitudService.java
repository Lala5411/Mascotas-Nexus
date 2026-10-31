package com.mascotanexus.backend.service;

import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.model.Solicitud;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private MascotaRepository mascotaRepository;

    public Solicitud crearSolicitud(Solicitud solicitud) {
        solicitud.setEstado("PENDIENTE");
        return solicitudRepository.save(solicitud);
    }

    public List<Solicitud> listarTodas() {
        return solicitudRepository.findAll();
    }

    public Solicitud cambiarEstado(Long solicitudId, String nuevoEstado) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado(nuevoEstado);

        // Si la solicitud es APROBADA, cambiamos el estado de la mascota a ADOPTADO
        if ("APROBADA".equalsIgnoreCase(nuevoEstado)) {
            Mascota mascota = solicitud.getMascota();
            mascota.setEstado("ADOPTADO");
            mascotaRepository.save(mascota);
        }

        return solicitudRepository.save(solicitud);
    }
}