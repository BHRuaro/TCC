package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.UserDTO;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.service.UserService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController extends CrudController<User, UserDTO, Long> {

    @Autowired
    public UserController(UserService service) {
        super(service);
    }
}
