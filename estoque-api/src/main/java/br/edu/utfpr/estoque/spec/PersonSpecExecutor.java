package br.edu.utfpr.estoque.spec;

import br.edu.utfpr.estoque.model.Person;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PersonSpecExecutor extends JpaSpecificationExecutor<Person> {
}
