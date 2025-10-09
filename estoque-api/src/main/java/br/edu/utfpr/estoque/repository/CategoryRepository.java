package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.Category;
import br.edu.utfpr.estoque.shared.CrudRepository;
import br.edu.utfpr.estoque.spec.CategorySpecExecutor;

public interface CategoryRepository extends CrudRepository<Category, Long>, CategorySpecExecutor {
}
