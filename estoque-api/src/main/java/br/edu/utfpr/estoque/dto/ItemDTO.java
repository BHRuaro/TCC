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
public class ItemDTO implements Identifiable<Long> {

    private Long id;
    private SupplierDTO supplier;
    private String name;
    private String description;
    private Double unitPrice;
    private Integer stockQuantity;
    private Integer minStockQuantity;
    private String expirationDate;
    private Integer movementLimit;
    private CategoryDTO category;
    private Long userId;
}
