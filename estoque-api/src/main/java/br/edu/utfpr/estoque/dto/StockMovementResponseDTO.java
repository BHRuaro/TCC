package br.edu.utfpr.estoque.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockMovementResponseDTO {
    private StockMovementDTO movement;
    private List<String> warnings;
}