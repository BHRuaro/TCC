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
public class ItemMovementDTO implements Identifiable<Long> {

    private Long id;
    private Long itemId;
    private Integer quantity;
}
