package com.mascotanexus.backend.repository;

import com.mascotanexus.backend.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndMascotaIdAndEstado(Long usuarioId, Long mascotaId, String estado);

    long countByEstado(String estado);

    boolean existsByMascotaIdAndEstado(Long mascotaId, String estado);

    boolean existsByMascotaId(Long mascotaId);
}