package br.edu.utfpr.estoque.repository;

import br.edu.utfpr.estoque.model.Supplier;
import br.edu.utfpr.estoque.shared.CrudRepository;
import br.edu.utfpr.estoque.spec.SupplierSpecExecutor;

public interface SupplierRepository extends CrudRepository<Supplier, Long>, SupplierSpecExecutor {
}
