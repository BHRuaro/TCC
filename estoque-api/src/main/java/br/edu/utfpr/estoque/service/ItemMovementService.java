package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.ItemMovementDTO;
import br.edu.utfpr.estoque.model.ItemMovement;
import br.edu.utfpr.estoque.repository.ItemMovementRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemMovementService extends CrudService<ItemMovement, ItemMovementDTO, Long> {

    @Autowired
    public ItemMovementService(ItemMovementRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, ItemMovement.class, ItemMovementDTO.class);
    }
}
