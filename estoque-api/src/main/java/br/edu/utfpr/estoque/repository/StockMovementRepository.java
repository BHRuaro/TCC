package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.StockMovement;
import br.edu.utfpr.estoque.shared.CrudRepository;
import br.edu.utfpr.estoque.spec.StockMovementSpecExecutor;

public interface StockMovementRepository extends CrudRepository<StockMovement, Long>, StockMovementSpecExecutor {
}
