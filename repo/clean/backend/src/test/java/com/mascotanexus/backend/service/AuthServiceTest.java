package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.AuthRequest;
import com.mascotanexus.backend.dto.AuthResponse;
import com.mascotanexus.backend.model.Usuario;
import com.mascotanexus.backend.repository.UsuarioRepository;
import com.mascotanexus.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Test
    void loginIncluyeElIdDelUsuarioEnLaRespuesta() {
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtUtil jwtUtil = mock(JwtUtil.class);
        AuthService authService = new AuthService(usuarioRepository, passwordEncoder, jwtUtil);
        Usuario usuario = new Usuario(42L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        AuthRequest request = new AuthRequest();
        request.setEmail("adoptante@example.com");
        request.setPassword("password");

        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(request.getPassword(), usuario.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(usuario.getEmail(), usuario.getRol())).thenReturn("token");

        AuthResponse respuesta = authService.login(request);

        assertEquals(42L, respuesta.getUsuarioId());
        assertEquals("token", respuesta.getToken());
    }
}
