package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.Person;
import br.edu.utfpr.estoque.shared.CrudRepository;

public interface PersonRepository extends CrudRepository<Person, Long> {
}
