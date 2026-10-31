package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.model.Solicitud;
import com.mascotanexus.backend.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @PostMapping
    public ResponseEntity<Solicitud> crearSolicitud(@RequestBody Solicitud solicitud) {
        return ResponseEntity.ok(solicitudService.crearSolicitud(solicitud));
    }

    @GetMapping
    public ResponseEntity<List<Solicitud>> listarSolicitudes() {
        return ResponseEntity.ok(solicitudService.listarTodas());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Solicitud> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        return ResponseEntity.ok(solicitudService.cambiarEstado(id, estado));
    }
}