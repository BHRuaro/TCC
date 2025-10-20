package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.ItemMovement;
import br.edu.utfpr.estoque.shared.CrudRepository;
import br.edu.utfpr.estoque.spec.ItemMovementSpecExecutor;

public interface ItemMovementRepository extends CrudRepository<ItemMovement, Long>, ItemMovementSpecExecutor {

}
