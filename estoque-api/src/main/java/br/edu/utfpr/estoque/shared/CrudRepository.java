package br.edu.utfpr.estoque.shared;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean
public interface CrudRepository<T extends Identifiable<ID>, ID> extends JpaRepository<T, ID> {
}