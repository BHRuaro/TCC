package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.StockMovementDTO;
import br.edu.utfpr.estoque.dto.StockMovementResponse;
import br.edu.utfpr.estoque.model.Item;
import br.edu.utfpr.estoque.model.ItemMovement;
import br.edu.utfpr.estoque.model.StockMovement;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.model.enums.MovementType;
import br.edu.utfpr.estoque.repository.ItemRepository;
import br.edu.utfpr.estoque.repository.StockMovementRepository;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StockMovementService extends CrudService<StockMovement, StockMovementDTO, Long> {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    @Autowired
    public StockMovementService(
            StockMovementRepository repository,
            DtoMapper dtoMapper,
            UserRepository userRepository,
            ItemRepository itemRepository
    ) {
        super(repository, dtoMapper, StockMovement.class, StockMovementDTO.class);
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    private void applyMovementToItem(Item item, ItemMovement itemMovement, MovementType type) {
        int quantity = itemMovement.getQuantity();
        if (type == MovementType.ENTRADA) {
            item.setStockQuantity(item.getStockQuantity() + quantity);
        } else if (type == MovementType.SAIDA) {
            item.setStockQuantity(item.getStockQuantity() - quantity);
        }
    }

    @Transactional
    public StockMovementResponse saveEntityWithWarning(StockMovement movement) {
        MovementType type = movement.getType();
        List<String> warnings = new ArrayList<>();

        if (type == MovementType.ENTRADA && movement.getSupplier() == null)
            throw new IllegalArgumentException("Fornecedor é obrigatório para ENTRADA.");
        if (type == MovementType.SAIDA && movement.getPerson() == null)
            throw new IllegalArgumentException("Pessoa é obrigatória para SAÍDA.");

        if (movement.getUser() == null || movement.getUser().getId() == null)
            throw new IllegalArgumentException("O identificador do usuário é obrigatório.");

        User user = userRepository.findById(movement.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        movement.setUser(user);

        if (movement.getItemMovements() != null) {
            for (ItemMovement itemMovement : movement.getItemMovements()) {
                Item itemRef = itemMovement.getItem();

                if (itemRef == null || itemRef.getId() == null)
                    throw new IllegalArgumentException("Item inválido na movimentação.");

                Item item = itemRepository.findById(itemRef.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Item não encontrado: ID " + itemRef.getId()));

                int quantity = itemMovement.getQuantity();

                if (quantity <= 0)
                    throw new IllegalArgumentException("A quantidade deve ser maior que zero.");

                if (type == MovementType.SAIDA) {
                    if (item.getMovementLimit() != null && item.getMovementLimit() > 0 && quantity > item.getMovementLimit())
                        throw new IllegalArgumentException("A quantidade (" + quantity + ") excede o limite de movimentação definido para o item: " + item.getName());

                    if (item.getExpirationDate() != null && item.getExpirationDate().isBefore(LocalDate.now()))
                        throw new IllegalArgumentException("O item '" + item.getName() + "' está com a data de validade vencida.");

                    if (item.getStockQuantity() < quantity)
                        throw new IllegalArgumentException("Estoque insuficiente para o item: " + item.getName());

                    int newStock = item.getStockQuantity() - quantity;
                    if (item.getMinStockQuantity() != null && item.getMinStockQuantity() > 0 && newStock < item.getMinStockQuantity()) {
                        warnings.add("Atenção: o estoque do item '" + item.getName() + "' ficou abaixo do mínimo (" + item.getMinStockQuantity() + ").");
                    }
                }

                applyMovementToItem(item, itemMovement, type);
                itemRepository.save(item);

                itemMovement.setItem(item);
                itemMovement.setMovement(movement);
            }
        }

        StockMovement saved = repository.save(movement);

        return StockMovementResponse.builder()
                .movement(saved)
                .warnings(warnings)
                .build();
    }

    public StockMovementDTO mapToDto(StockMovement entity) {
        StockMovementDTO dto = dtoMapper.toDto(entity, StockMovementDTO.class);
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUserName(entity.getUser().getName());
        }
        return dto;
    }

    @Override
    public List<StockMovementDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public Optional<StockMovementDTO> findById(Long id) {
        return repository.findById(id).map(this::mapToDto);
    }
}