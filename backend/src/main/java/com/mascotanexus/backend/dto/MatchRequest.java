package com.mascotanexus.backend.dto;

import lombok.Data;

@Data
public class MatchRequest {
    private String tipoVivienda; // "APARTAMENTO" o "CASA"
    private Integer horasLibres; // Horas al día disponibles para la mascota
    private Boolean tieneNinos;
    private String nivelActividad; // "BAJO", "MEDIO" o "ALTO"
}