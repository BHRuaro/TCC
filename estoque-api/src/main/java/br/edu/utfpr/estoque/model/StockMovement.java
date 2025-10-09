package br.edu.utfpr.estoque.model;

import br.edu.utfpr.estoque.shared.Identifiable;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "movement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement implements Identifiable<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @OneToMany(mappedBy = "movement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemMovement> itemMovements;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
}
