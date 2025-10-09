package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.StockMovementDTO;
import br.edu.utfpr.estoque.model.StockMovement;
import br.edu.utfpr.estoque.repository.StockMovementRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockMovementService extends CrudService<StockMovement, StockMovementDTO, Long> {

    @Autowired
    public StockMovementService(StockMovementRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, StockMovement.class, StockMovementDTO.class);
    }
}
