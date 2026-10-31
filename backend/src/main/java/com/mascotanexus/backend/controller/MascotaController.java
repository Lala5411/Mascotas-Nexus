package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    @GetMapping
    public ResponseEntity<List<Mascota>> listarMascotas() {
        return ResponseEntity.ok(mascotaService.listarTodas());
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Mascota>> listarDisponibles() {
        return ResponseEntity.ok(mascotaService.listarDisponibles());
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