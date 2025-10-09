package br.edu.utfpr.estoque.controller;


import br.edu.utfpr.estoque.dto.CategoryDTO;
import br.edu.utfpr.estoque.model.Category;
import br.edu.utfpr.estoque.service.CategoryService;
import br.edu.utfpr.estoque.shared.CrudController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CategoryController extends CrudController<Category, CategoryDTO, Long> {

    @Autowired
    public CategoryController(CategoryService service) {
        super(service);
    }
}