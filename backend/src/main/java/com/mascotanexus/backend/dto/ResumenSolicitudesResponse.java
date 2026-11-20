package com.mascotanexus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumenSolicitudesResponse {
    private long pendientes;
    private long aprobadas;
    private long rechazadas;
    private long canceladas;
    private long total;
}
