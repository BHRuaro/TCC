package br.edu.utfpr.estoque.dto;

import br.edu.utfpr.estoque.shared.Identifiable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO implements Identifiable<Long> {

    private Long id;

    @NotBlank(message = "A descrição da cateogria não pode ser vazia.")
    private String description;
}
