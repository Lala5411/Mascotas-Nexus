package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.MascotaResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;

    public MascotaService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    public List<Mascota> listarTodas() {
        return mascotaRepository.findAll();
    }

    public List<Mascota> listarDisponibles() {
        return mascotaRepository.findByEstado("DISPONIBLE");
    }

    public List<MascotaResponse> filtrarDisponibles(String especie, Integer edadMaxima) {
        String especieNormalizada = especie == null || especie.isBlank()
                ? null
                : especie.trim();

        return mascotaRepository.filtrarDisponibles(especieNormalizada, edadMaxima).stream()
                .map(mascota -> new MascotaResponse(
                        mascota.getId(),
                        mascota.getNombre(),
                        mascota.getEspecie(),
                        mascota.getEdad(),
                        mascota.getEstado(),
                        mascota.getImagenUrl()))
                .toList();
    }

    public Mascota guardar(Mascota mascota) {
        if (mascota.getEstado() == null) {
            mascota.setEstado("DISPONIBLE");
        }
        return mascotaRepository.save(mascota);
    }

    public void eliminar(Long id) {
        mascotaRepository.deleteById(id);
    }
}