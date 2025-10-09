package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.StockMovementDTO;
import br.edu.utfpr.estoque.model.StockMovement;
import br.edu.utfpr.estoque.service.StockMovementService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/movements")
public class StockMovementController extends CrudController<StockMovement, StockMovementDTO, Long> {

    @Autowired
    public StockMovementController(StockMovementService service) {
        super(service);
    }
}
