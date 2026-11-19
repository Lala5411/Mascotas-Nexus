package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.AuthRequest;
import com.mascotanexus.backend.dto.AuthResponse;
import com.mascotanexus.backend.model.Usuario;
import com.mascotanexus.backend.repository.UsuarioRepository;
import com.mascotanexus.backend.security.JwtUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

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

    @Test
    void loginConCorreoInexistenteDevuelveNoAutorizado() {
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        AuthService authService = new AuthService(
                usuarioRepository, mock(PasswordEncoder.class), mock(JwtUtil.class));
        AuthRequest request = new AuthRequest();
        request.setEmail("desconocido@example.com");
        request.setPassword("password");
        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        ResponseStatusException exception = Assertions.assertThrows(
                ResponseStatusException.class, () -> authService.login(request));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }

    @Test
    void loginConContrasenaIncorrectaDevuelveNoAutorizado() {
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        AuthService authService = new AuthService(usuarioRepository, passwordEncoder, mock(JwtUtil.class));
        Usuario usuario = new Usuario(42L, "Adoptante", "adoptante@example.com", "hash", "ROLE_USER");
        AuthRequest request = new AuthRequest();
        request.setEmail(usuario.getEmail());
        request.setPassword("incorrecta");
        when(usuarioRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(request.getPassword(), usuario.getPassword())).thenReturn(false);

        ResponseStatusException exception = Assertions.assertThrows(
                ResponseStatusException.class, () -> authService.login(request));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }
}
