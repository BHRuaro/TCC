package br.edu.utfpr.estoque.dto;

import br.edu.utfpr.estoque.model.StockMovement;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockMovementResponse {
    private StockMovement movement;
    private List<String> warnings;
}
