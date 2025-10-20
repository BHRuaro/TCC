package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.StockMovementDTO;
import br.edu.utfpr.estoque.model.Item;
import br.edu.utfpr.estoque.model.ItemMovement;
import br.edu.utfpr.estoque.model.StockMovement;
import br.edu.utfpr.estoque.model.enums.MovementType;
import br.edu.utfpr.estoque.repository.ItemMovementRepository;
import br.edu.utfpr.estoque.repository.ItemRepository;
import br.edu.utfpr.estoque.repository.StockMovementRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StockMovementService extends CrudService<StockMovement, StockMovementDTO, Long> {

    private final ItemRepository itemRepository;
    private final ItemMovementRepository itemMovementRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public StockMovementService(
            StockMovementRepository repository,
            DtoMapper dtoMapper,
            ItemRepository itemRepository,
            ItemMovementRepository itemMovementRepository
    ) {
        super(repository, dtoMapper, StockMovement.class, StockMovementDTO.class);
        this.itemRepository = itemRepository;
        this.itemMovementRepository = itemMovementRepository;
    }

    private void applyMovementToItem(Item item, ItemMovement itemMovement, MovementType type) {
        int quantity = itemMovement.getQuantity();
        if (type == MovementType.ENTRADA) {
            item.setStockQuantity(item.getStockQuantity() + quantity);
        } else if (type == MovementType.SAIDA) {
            item.setStockQuantity(item.getStockQuantity() - quantity);
        }
    }

    @Override
    @Transactional
    public StockMovement saveEntity(StockMovement movement) {
        MovementType type = movement.getType();

        if (type == MovementType.ENTRADA && movement.getSupplier() == null)
            throw new IllegalArgumentException("Fornecedor é obrigatório para ENTRADA.");
        if (type == MovementType.SAIDA && movement.getPerson() == null)
            throw new IllegalArgumentException("Pessoa é obrigatória para SAÍDA.");

        // Garante o vínculo bidirecional antes de salvar
        if (movement.getItemMovements() != null) {
            for (ItemMovement itemMovement : movement.getItemMovements()) {
                itemMovement.setMovement(movement);
            }
        }

        return repository.saveAndFlush(movement);
    }
}