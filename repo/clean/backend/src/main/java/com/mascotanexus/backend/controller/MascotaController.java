package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.dto.MascotaResponse;
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.service.MascotaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public ResponseEntity<List<Mascota>> listarMascotas() {
        return ResponseEntity.ok(mascotaService.listarTodas());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Mascota>> listarDisponibles() {
        return ResponseEntity.ok(mascotaService.listarDisponibles());
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<MascotaResponse>> filtrarMascotas(
            @RequestParam(required = false) String especie,
            @RequestParam(required = false) Integer edadMaxima) {
        if (edadMaxima != null && edadMaxima < 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(mascotaService.filtrarDisponibles(especie, edadMaxima));
    }

    @PostMapping
    public ResponseEntity<Mascota> crearMascota(@RequestBody Mascota mascota) {
        return ResponseEntity.ok(mascotaService.guardar(mascota));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Long id) {
        mascotaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}