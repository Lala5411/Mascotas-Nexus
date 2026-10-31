package com.mascotanexus.backend.controller;

import com.mascotanexus.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/archivos")
@CrossOrigin(origins = "*")
public class ArchivoController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String,String>> subirImagen(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileStorageService.guardarImagen(file);
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("url", url);
            return ResponseEntity.ok(respuesta);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
}