package com.mascotanexus.backend.dto;

import com.mascotanexus.backend.model.Mascota;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MatchResponse {
    private Mascota mascota;
    private Integer porcentajeCompatibilidad;
    private String justificacion;
}