package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.ItemDTO;
import br.edu.utfpr.estoque.model.Item;
import br.edu.utfpr.estoque.service.ItemService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/items")
public class ItemController extends CrudController<Item, ItemDTO, Long> {

    @Autowired
    public ItemController(ItemService service) {
        super(service);
    }
}
