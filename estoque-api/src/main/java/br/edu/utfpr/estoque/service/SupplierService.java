package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.SupplierDTO;
import br.edu.utfpr.estoque.model.Supplier;
import br.edu.utfpr.estoque.repository.SupplierRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupplierService extends CrudService<Supplier, SupplierDTO, Long> {

    @Autowired
    public SupplierService(SupplierRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, Supplier.class, SupplierDTO.class);
    }
}
