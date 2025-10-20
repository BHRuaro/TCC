package br.edu.utfpr.estoque.dto;

import br.edu.utfpr.estoque.model.enums.MovementType;
import br.edu.utfpr.estoque.shared.Identifiable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockMovementDTO implements Identifiable<Long> {

        private Long id;
        private Long userId;
        private Long personId;
        private LocalDateTime dateTime;
        private MovementType type;
        private Long supplierId;
        private String observation;
        private List<ItemMovementDTO> itemMovements;
    }