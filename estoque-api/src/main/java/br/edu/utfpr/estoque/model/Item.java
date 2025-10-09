package br.edu.utfpr.estoque.model;

import br.edu.utfpr.estoque.shared.Identifiable;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    private Float unitPrice;

    private Integer stockQuantity;

    private LocalDate expirationDate;

    private Integer movementLimit;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
}
