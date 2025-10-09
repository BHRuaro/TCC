package br.edu.utfpr.estoque.shared;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

public abstract class CrudController<T extends Identifiable<ID>, DTO, ID> {

    protected final CrudService<T, DTO, ID> service;

    protected CrudController(CrudService<T, DTO, ID> service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTO> findById(@PathVariable ID id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DTO> create(@RequestBody DTO dto) {
        DTO saved = service.save(dto);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DTO> update(@PathVariable ID id, @RequestBody DTO dto) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // você pode reaproveitar o save, ou implementar um update específico no CrudService
        DTO updated = service.save(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}