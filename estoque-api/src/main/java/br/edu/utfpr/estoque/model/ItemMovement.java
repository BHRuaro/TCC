package br.edu.utfpr.estoque.model;

import br.edu.utfpr.estoque.shared.Identifiable;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "item_movement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemMovement implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_movement_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "movement_id", nullable = false)
    private StockMovement movement;

    @Column(nullable = false)
    private Integer quantity;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
}
