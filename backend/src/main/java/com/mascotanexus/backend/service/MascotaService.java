package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.MascotaResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.SolicitudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class MascotaService {

    private static final int LONGITUD_MAXIMA_NOMBRE = 60;
    private static final int EDAD_MINIMA = 0;
    private static final int EDAD_MAXIMA = 30;
    private static final String DISPONIBLE = "DISPONIBLE";
    private static final Set<String> ESTADOS_PERMITIDOS = Set.of(DISPONIBLE, "ADOPTADO");

    private final MascotaRepository mascotaRepository;
    private final SolicitudRepository solicitudRepository;

    public MascotaService(MascotaRepository mascotaRepository, SolicitudRepository solicitudRepository) {
        this.mascotaRepository = mascotaRepository;
        this.solicitudRepository = solicitudRepository;
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
        String nombre = mascota.getNombre() == null ? "" : mascota.getNombre().trim();
        String especie = mascota.getEspecie() == null ? "" : mascota.getEspecie().trim();
        String estado = mascota.getEstado() == null
                ? DISPONIBLE
                : mascota.getEstado().trim().toUpperCase(Locale.ROOT);

        if (nombre.isEmpty() || nombre.length() > LONGITUD_MAXIMA_NOMBRE) {
            throw datoInvalido("El nombre es obligatorio y tiene como máximo 60 caracteres.");
        }
        if (especie.isEmpty()) {
            throw datoInvalido("La especie es obligatoria.");
        }
        if (mascota.getEdad() == null || mascota.getEdad() < EDAD_MINIMA || mascota.getEdad() > EDAD_MAXIMA) {
            throw datoInvalido("La edad debe ser un número entero entre 0 y 30.");
        }
        if (!ESTADOS_PERMITIDOS.contains(estado)) {
            throw datoInvalido("El estado debe ser DISPONIBLE o ADOPTADO.");
        }

        mascota.setNombre(nombre);
        mascota.setEspecie(especie);
        mascota.setEstado(estado);
        return mascotaRepository.save(mascota);
    }

    private ResponseStatusException datoInvalido(String mensaje) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, mensaje);
    }

    public void eliminar(Long id) {
        if (!mascotaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mascota no encontrada.");
        }
        if (solicitudRepository.existsByMascotaIdAndEstado(id, "PENDIENTE")) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La mascota tiene solicitudes pendientes; respóndelas antes de eliminarla.");
        }
        if (solicitudRepository.existsByMascotaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "La mascota tiene historial de solicitudes y no se puede eliminar.");
        }
        mascotaRepository.deleteById(id);
    }
}