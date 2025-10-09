package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.Item;
import br.edu.utfpr.estoque.shared.CrudRepository;
import br.edu.utfpr.estoque.spec.ItemSpecExecutor;

public interface ItemRepository extends CrudRepository<Item, Long>, ItemSpecExecutor {
}
