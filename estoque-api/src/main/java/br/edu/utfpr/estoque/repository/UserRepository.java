package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.shared.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByUsername(String username);

}
