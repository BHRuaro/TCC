package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.StockMovementDTO;
import br.edu.utfpr.estoque.exceptionHandler.OperationNotAllowedException;
import br.edu.utfpr.estoque.model.StockMovement;
import br.edu.utfpr.estoque.service.StockMovementService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movements")
public class StockMovementController extends CrudController<StockMovement, StockMovementDTO, Long> {

    private final StockMovementService stockMovementService;

    @Autowired
    public StockMovementController(StockMovementService service, StockMovementService stockMovementService) {
        super(service);
        this.stockMovementService = stockMovementService;
    }

    @Override
    @PostMapping
    public ResponseEntity<StockMovementDTO> create(@RequestBody StockMovementDTO dto) {
        StockMovement entity = stockMovementService.getDtoMapper().toEntity(dto, StockMovement.class);
        StockMovement saved = stockMovementService.saveEntity(entity);
        StockMovementDTO savedDto = stockMovementService.getDtoMapper().toDto(saved, StockMovementDTO.class);
        return ResponseEntity.ok(savedDto);
    }


    @Override
    @PutMapping("/{id}")
    public ResponseEntity<StockMovementDTO> update(@PathVariable Long id, @RequestBody StockMovementDTO dto) {
        throw new OperationNotAllowedException("Atualização de movimentações não é permitida. Caso seja necessário uma correção, realize uma nova movimentação.");
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        throw new OperationNotAllowedException("Não é permitido excluir movimentações. Caso seja necessário uma correção, realize uma nova movimentação.");
    }
}
