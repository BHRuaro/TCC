package br.edu.utfpr.estoque.controller;

import br.edu.utfpr.estoque.dto.SupplierDTO;
import br.edu.utfpr.estoque.model.Supplier;
import br.edu.utfpr.estoque.service.SupplierService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/suppliers")
public class SupplierController extends CrudController<Supplier, SupplierDTO, Long>{

    @Autowired
    public SupplierController(SupplierService service) {
        super(service);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupplierDTO> create(SupplierDTO supplierDTO) {
        return super.create(supplierDTO);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupplierDTO> update(Long id, SupplierDTO supplierDTO) {
        return super.update(id, supplierDTO);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(Long id) {
        return super.delete(id);
    }
}
