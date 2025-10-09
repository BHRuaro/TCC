package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.CategoryDTO;
import br.edu.utfpr.estoque.model.Category;
import br.edu.utfpr.estoque.repository.CategoryRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService extends CrudService<Category, CategoryDTO, Long> {

    @Autowired
    public CategoryService(CategoryRepository repository, DtoMapper dtoMapper) {
        super(repository, dtoMapper, Category.class, CategoryDTO.class);
    }
}