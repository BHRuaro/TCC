package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.UserDTO;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends CrudService<User, UserDTO, Long> {

    @Autowired
    public UserService(UserRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, User.class, UserDTO.class);
    }
}
