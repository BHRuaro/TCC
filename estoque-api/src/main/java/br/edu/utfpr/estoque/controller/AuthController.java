package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.UserCreateDTO;
import br.edu.utfpr.estoque.dto.UserDTO;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.security.JwtService;
import br.edu.utfpr.estoque.security.dto.AuthRequest;
import br.edu.utfpr.estoque.security.dto.AuthResponse;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dtoMapper;

    public AuthController(AuthenticationManager authManager, JwtService jwtService,
                          UserRepository userRepository, PasswordEncoder passwordEncoder, DtoMapper dtoMapper) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dtoMapper = dtoMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        String token = jwtService.generateToken(request.getUsername());
        long expiresIn = jwtService.getJwtExpirationMs() / 1000;

        AuthResponse response = new AuthResponse(token, expiresIn, user.getRole(), user.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> register(@RequestBody UserCreateDTO dto) {
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória ao criar o usuário.");
        }

        User user = User.builder()
                .name(dto.getName())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole() != null ? dto.getRole() : "ROLE_USER")
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        User saved = userRepository.save(user);
        return ResponseEntity.ok(dtoMapper.toDto(saved, UserDTO.class));
    }
}
