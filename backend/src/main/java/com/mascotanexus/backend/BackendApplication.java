package com.mascotanexus.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

// Reemplaza o ajusta estas importaciones según el paquete exacto donde tengas tus clases
import com.mascotanexus.backend.model.Mascota;
import com.mascotanexus.backend.model.Usuario;
import com.mascotanexus.backend.repository.MascotaRepository;
import com.mascotanexus.backend.repository.UsuarioRepository;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepo, MascotaRepository mascotaRepo, PasswordEncoder encoder) {
        return args -> {
            if (usuarioRepo.findByEmail("admin@nexus.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador Refugio");
                admin.setEmail("admin@nexus.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRol("ROLE_ADMIN");
                usuarioRepo.save(admin);
            }

            if (usuarioRepo.findByEmail("usuario@nexus.com").isEmpty()) {
                Usuario user = new Usuario();
                user.setNombre("Juan Pérez");
                user.setEmail("usuario@nexus.com");
                user.setPassword(encoder.encode("user123"));
                user.setRol("ROLE_USER");
                usuarioRepo.save(user);
            }

            if (mascotaRepo.count() == 0) {
                Mascota m1 = new Mascota();
                m1.setNombre("Firulais");
                m1.setEspecie("Perro");
                m1.setEdad(2);
                m1.setEstado("DISPONIBLE");
                m1.setImagenUrl("https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500");
                mascotaRepo.save(m1);

                Mascota m2 = new Mascota();
                m2.setNombre("Michi");
                m2.setEspecie("Gato");
                m2.setEdad(1);
                m2.setEstado("DISPONIBLE");
                m2.setImagenUrl("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500");
                mascotaRepo.save(m2);

                Mascota m3 = new Mascota();
                m3.setNombre("Luna");
                m3.setEspecie("Perro");
                m3.setEdad(3);
                m3.setEstado("DISPONIBLE");
                m3.setImagenUrl("https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500");
                mascotaRepo.save(m3);
            }
        };
    }
}