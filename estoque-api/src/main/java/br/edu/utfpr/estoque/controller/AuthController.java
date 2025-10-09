package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.security.JwtService;
import br.edu.utfpr.estoque.security.dto.AuthRequest;
import br.edu.utfpr.estoque.security.dto.AuthResponse;
import br.edu.utfpr.estoque.security.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
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

    public AuthController(AuthenticationManager authManager, JwtService jwtService,
                          UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(request.getUsername());
        long expiresIn = jwtService.getJwtExpirationMs() / 1000;

        return ResponseEntity.ok(new AuthResponse(token, expiresIn));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_OPERATOR")
                .active(true)
                .build();

        return ResponseEntity.ok(userRepository.save(user));
    }
}
