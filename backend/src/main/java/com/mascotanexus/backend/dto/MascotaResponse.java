package com.mascotanexus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MascotaResponse {
    private Long id;
    private String nombre;
    private String especie;
    private Integer edad;
    private String estado;
    private String imagenUrl;
}
