package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.PersonDTO;
import br.edu.utfpr.estoque.model.Person;
import br.edu.utfpr.estoque.repository.PersonRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService extends CrudService<Person, PersonDTO, Long> {

    @Autowired
    public PersonService(PersonRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, Person.class, PersonDTO.class);
    }
}
