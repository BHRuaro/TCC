package br.edu.utfpr.estoque.controller;


import br.edu.utfpr.estoque.dto.CategoryDTO;
import br.edu.utfpr.estoque.model.Category;
import br.edu.utfpr.estoque.service.CategoryService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CategoryController extends CrudController<Category, CategoryDTO, Long> {

    @Autowired
    public CategoryController(CategoryService service) {
        super(service);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> create(@RequestBody CategoryDTO dto) {
        return super.create(dto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> update(@PathVariable Long id, @RequestBody CategoryDTO dto) {
        return super.update(id, dto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return super.delete(id);
    }
}