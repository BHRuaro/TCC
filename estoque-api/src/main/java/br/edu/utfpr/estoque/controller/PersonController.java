package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.PersonDTO;
import br.edu.utfpr.estoque.model.Person;
import br.edu.utfpr.estoque.service.PersonService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/person")
public class PersonController extends CrudController<Person, PersonDTO, Long> {

    @Autowired
    public PersonController(PersonService service) {
        super(service);
    }
}
