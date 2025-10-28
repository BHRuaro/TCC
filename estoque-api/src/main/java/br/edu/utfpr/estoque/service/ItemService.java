package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.ItemDTO;
import br.edu.utfpr.estoque.model.Item;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.repository.ItemRepository;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemService extends CrudService<Item, ItemDTO, Long> {

    private final UserRepository userRepository;

    @Autowired
    public ItemService(ItemRepository repository, DtoMapper dtoMapper, UserRepository userRepository) {
        super(repository, dtoMapper, Item.class, ItemDTO.class);
        this.userRepository = userRepository;
    }

    @Override
    public ItemDTO save(ItemDTO dto) {
        Item item = dtoMapper.toEntity(dto, Item.class);

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            item.setUser(user);
        } else {
            throw new IllegalArgumentException("O identificador do usuário é obrigatório.");
        }

        Item saved = repository.save(item);
        return dtoMapper.toDto(saved, ItemDTO.class);
    }
}
