package com.mascotanexus.backend.repository;

import com.mascotanexus.backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByEstado(String estado);
}