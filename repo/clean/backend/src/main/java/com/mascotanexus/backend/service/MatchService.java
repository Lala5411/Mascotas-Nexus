package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.MatchRequest;
import com.mascotanexus.backend.dto.MatchResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchService {

    @Autowired
    private MascotaRepository mascotaRepository;

    public List<MatchResponse> calcularCompatibilidad(MatchRequest request) {
        List<Mascota> disponibles = mascotaRepository.findByEstado("DISPONIBLE");
        List<MatchResponse> resultados = new ArrayList<>();

        for (Mascota m : disponibles) {
            int puntaje = 50; // Puntaje base
            StringBuilder justificacion = new StringBuilder();

            // Regla 1: Espacio en hogar
            if ("APARTAMENTO".equalsIgnoreCase(request.getTipoVivienda())) {
                if ("Gato".equalsIgnoreCase(m.getEspecie())) {
                    puntaje += 25;
                    justificacion.append("Los gatos se adaptan excelente a apartamentos. ");
                } else if (m.getEdad() > 3) {
                    puntaje += 15;
                    justificacion.append("Perro adulto ideal para espacios reducidos. ");
                }
            } else { // Casa con patio
                if ("Perro".equalsIgnoreCase(m.getEspecie())) {
                    puntaje += 20;
                    justificacion.append("Perfecto para disfrutar un patio amplio. ");
                }
            }

            // Regla 2: Disponibilidad de tiempo y edad del animal
            if (request.getHorasLibres() < 3 && m.getEdad() < 2) {
                puntaje -= 20; // Cachorro requiere mucho tiempo
            } else if (request.getHorasLibres() >= 4) {
                puntaje += 15;
                justificacion.append("Tienes el tiempo ideal para sus paseos y cuidados. ");
            }

            // Regla 3: Nivel de actividad
            if ("ALTO".equalsIgnoreCase(request.getNivelActividad()) && "Perro".equalsIgnoreCase(m.getEspecie()) && m.getEdad() <= 3) {
                puntaje += 15;
                justificacion.append("Compañero con energía equivalente a tu ritmo de vida. ");
            }

            // Normalizar entre 0 y 100%
            puntaje = Math.min(100, Math.max(10, puntaje));

            resultados.add(new MatchResponse(m, puntaje, justificacion.toString()));
        }

        // Ordenar de mayor a menor compatibilidad
        resultados.sort((a, b) -> b.getPorcentajeCompatibilidad().compareTo(a.getPorcentajeCompatibilidad()));
        return resultados;
    }
}