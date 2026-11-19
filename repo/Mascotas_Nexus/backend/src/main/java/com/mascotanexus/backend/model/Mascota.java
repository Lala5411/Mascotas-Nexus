package com.mascotanexus.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mascota")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String especie; // Perro, Gato, etc.

    @Column(nullable = false)
    private Integer edad;

    @Column(nullable = false)
    private String estado; // DISPONIBLE o ADOPTADO

    @Column(length = 500)
    private String imagenUrl; // URL de la imagen de la mascota
}