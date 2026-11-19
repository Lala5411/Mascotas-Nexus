package com.mascotanexus.backend.dto;

import com.mascotanexus.backend.model.Solicitud;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SolicitudResponse {
    private Long id;
    private Long mascotaId;
    private String mascotaNombre;
    private String mensaje;
    private String estado;

    public static SolicitudResponse from(Solicitud solicitud) {
        return new SolicitudResponse(
                solicitud.getId(),
                solicitud.getMascota().getId(),
                solicitud.getMascota().getNombre(),
                solicitud.getMensaje(),
                solicitud.getEstado());
    }
}
