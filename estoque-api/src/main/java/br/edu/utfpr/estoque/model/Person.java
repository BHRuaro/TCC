package br.edu.utfpr.estoque.model;

import br.edu.utfpr.estoque.shared.Identifiable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "person")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person implements Identifiable<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String cpf;

    @NotBlank
    private String name;

    private String email;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
}
