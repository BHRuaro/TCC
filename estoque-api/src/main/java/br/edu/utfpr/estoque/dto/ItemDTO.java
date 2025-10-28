package br.edu.utfpr.estoque.dto;

import br.edu.utfpr.estoque.shared.Identifiable;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO implements Identifiable<Long> {

    private Long id;
    private String name;
    private String description;
    private BigDecimal unitPrice;
    private Integer stockQuantity;
    private Integer minStockQuantity;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate expirationDate;
    private Integer movementLimit;
    private Long categoryId;
    private Long supplierId;
    private Long userId;
    private String userName;
}
