package com.mascotanexus.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String UPLOAD_DIR = "uploads/";

    public String guardarImagen(MultipartFile archivo) throws IOException {
        File directorio = new File(UPLOAD_DIR);
        if (!directorio.exists()) {
            directorio.mkdirs();
        }

        // Generar un nombre único para la imagen
        String nombreUnico = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();
        Path rutaArchivo = Paths.get(UPLOAD_DIR + nombreUnico);

        Files.copy(archivo.getInputStream(), rutaArchivo);

        // Retornamos la URL pública local de la imagen
        return "http://localhost:8080/uploads/" + nombreUnico;
    }
}