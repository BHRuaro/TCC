package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.ItemDTO;
import br.edu.utfpr.estoque.model.Item;
import br.edu.utfpr.estoque.repository.ItemRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemService extends CrudService<Item, ItemDTO, Long> {

    @Autowired
    public ItemService(ItemRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, Item.class, ItemDTO.class);
    }
}
