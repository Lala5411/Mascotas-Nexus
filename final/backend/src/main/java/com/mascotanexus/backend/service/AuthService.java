package com.mascotanexus.backend.service;

import com.mascotanexus.backend.dto.AuthRequest;
import com.mascotanexus.backend.dto.AuthResponse;
import com.mascotanexus.backend.model.Usuario;
import com.mascotanexus.backend.repository.UsuarioRepository;
import com.mascotanexus.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final String CREDENCIALES_INVALIDAS = "Credenciales incorrectas.";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Usuario registrar(Usuario usuario) {
        // Encripta la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("ROLE_USER");
        }
        return usuarioRepository.save(usuario);
    }

    public AuthResponse login(AuthRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, CREDENCIALES_INVALIDAS));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, CREDENCIALES_INVALIDAS);
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
        return new AuthResponse(token, usuario.getNombre(), usuario.getRol(), usuario.getId());
    }
}