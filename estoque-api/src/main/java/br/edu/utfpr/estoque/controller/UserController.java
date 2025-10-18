package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.ChangePasswordRequest;
import br.edu.utfpr.estoque.dto.UserDTO;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.service.UserService;
import br.edu.utfpr.estoque.shared.CrudController;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController extends CrudController<User, UserDTO, Long> {

    private final DtoMapper dtoMapper;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserController(UserService service, DtoMapper dtoMapper, PasswordEncoder passwordEncoder) {
        super(service);
        this.dtoMapper = dtoMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable Long id,
            @RequestBody UserDTO dto
    ) {
        User user = service.findByIdEntity(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        user.setUsername(dto.getUsername());
        user.setName(dto.getName());
        user.setRole(dto.getRole());
        user.setActive(dto.getActive());
        User updatedUser = service.saveEntity(user);

        return ResponseEntity.ok(dtoMapper.toDto(updatedUser, UserDTO.class));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request
    ) {
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        User user = service.findByIdEntity(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        service.saveEntity(user);

        return ResponseEntity.ok().build();
    }
}