package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.PersonDTO;
import br.edu.utfpr.estoque.model.Person;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.repository.PersonRepository;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService extends CrudService<Person, PersonDTO, Long> {

    private final UserRepository userRepository;

    @Autowired
    public PersonService(PersonRepository repository, DtoMapper dtoMapper, UserRepository userRepository) {
        super(repository, dtoMapper, Person.class, PersonDTO.class);
        this.userRepository = userRepository;
    }

    @Override
    public PersonDTO save(PersonDTO dto) {
        Person person = dtoMapper.toEntity(dto, Person.class);

        if(dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            person.setUser(user);
        } else {
            throw new IllegalArgumentException("O identificador do usuário é obrigatório.");
        }

        Person saved = repository.save(person);
        return dtoMapper.toDto(saved, PersonDTO.class);
    }
}
