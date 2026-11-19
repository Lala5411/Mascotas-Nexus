package com.mascotanexus.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "solicitud")
@NoArgsConstructor
@Data
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "tipo_vivienda")
    private String tipoVivienda;

    @Column(name = "horas_libres")
    private Integer horasLibres;

    @Column(name = "nivel_actividad")
    private String nivelActividad;

    @Column(nullable = false)
    private String estado; // PENDIENTE o APROBADA

    public Solicitud(Long id, Usuario usuario, Mascota mascota, String mensaje, String estado) {
        this.id = id;
        this.usuario = usuario;
        this.mascota = mascota;
        this.mensaje = mensaje;
        this.estado = estado;
    }
}