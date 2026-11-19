package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.MatchRequest;
import com.mascotanexus.backend.dto.MatchResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class MatchService {

    private final MascotaRepository mascotaRepository;

    public MatchService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    public List<MatchResponse> calcularCompatibilidad(MatchRequest request) {
        validarRequest(request);

        return mascotaRepository.findByEstado("DISPONIBLE").stream()
                .map(mascota -> calcularCompatibilidad(mascota, request))
                .sorted(Comparator
                        .comparing(MatchResponse::getPorcentajeCompatibilidad)
                        .reversed()
                        .thenComparing(
                                resultado -> resultado.getMascota().getNombre(),
                                String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private MatchResponse calcularCompatibilidad(Mascota mascota, MatchRequest request) {
        int puntaje = 50;
        List<String> razones = new ArrayList<>();

        if ("APARTAMENTO".equalsIgnoreCase(request.getTipoVivienda())
                && "Gato".equalsIgnoreCase(mascota.getEspecie())) {
            puntaje += 20;
            razones.add("Los gatos suelen adaptarse bien a espacios interiores.");
        } else if ("CASA".equalsIgnoreCase(request.getTipoVivienda())
                && "Perro".equalsIgnoreCase(mascota.getEspecie())) {
            puntaje += 20;
            razones.add("Una casa con patio puede ofrecer espacio adicional para un perro.");
        }

        if (request.getHorasLibres() <= 2 && mascota.getEdad() <= 1) {
            puntaje -= 15;
            razones.add("Una mascota joven puede requerir más tiempo de adaptación del que tienes disponible.");
        } else if (request.getHorasLibres() >= 6 && mascota.getEdad() <= 2) {
            puntaje += 15;
            razones.add("Tu disponibilidad de tiempo puede ayudar con sus cuidados y adaptación.");
        }

        String nivelActividad = request.getNivelActividad().toUpperCase(Locale.ROOT);
        if ("ALTO".equals(nivelActividad)
                && "Perro".equalsIgnoreCase(mascota.getEspecie())
                && mascota.getEdad() <= 3) {
            puntaje += 15;
            razones.add("Su especie y edad pueden acompañar un ritmo de vida activo.");
        } else if ("BAJO".equals(nivelActividad) && mascota.getEdad() >= 5) {
            puntaje += 10;
            razones.add("Su edad puede encajar con una rutina más tranquila.");
        }

        if (razones.isEmpty()) {
            razones.add("No hay un ajuste especial con estos datos, pero sigue disponible para ti.");
        }

        return new MatchResponse(
                mascota,
                Math.min(100, Math.max(0, puntaje)),
                String.join(" ", razones));
    }

    private void validarRequest(MatchRequest request) {
        if (request == null
                || request.getTipoVivienda() == null
                || !List.of("APARTAMENTO", "CASA").contains(request.getTipoVivienda().toUpperCase(Locale.ROOT))
                || request.getHorasLibres() == null
                || request.getHorasLibres() < 1
                || request.getHorasLibres() > 12
                || request.getNivelActividad() == null
                || !List.of("BAJO", "MEDIO", "ALTO").contains(request.getNivelActividad().toUpperCase(Locale.ROOT))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Completa vivienda, horas disponibles y ritmo de vida válidos.");
        }
    }
}