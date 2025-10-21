package br.edu.utfpr.estoque.dto;

import br.edu.utfpr.estoque.shared.Identifiable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO implements Identifiable<Long> {

    private Long id;
    private String name;
    private String username;
    private String role;
    private Boolean active;
}