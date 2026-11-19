package com.mascotanexus.backend.repository;

import com.mascotanexus.backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByEstado(String estado);

    @Query("""
            SELECT mascota
            FROM Mascota mascota
            WHERE mascota.estado = 'DISPONIBLE'
              AND (:especie IS NULL OR LOWER(mascota.especie) = LOWER(:especie))
              AND (:edadMaxima IS NULL OR mascota.edad <= :edadMaxima)
            """)
    List<Mascota> filtrarDisponibles(
            @Param("especie") String especie,
            @Param("edadMaxima") Integer edadMaxima);
}
