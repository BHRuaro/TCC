package br.edu.utfpr.estoque.shared;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;


@Transactional
public abstract class CrudService<T extends Identifiable<ID>, DTO extends Identifiable<ID>, ID> {

    protected final JpaRepository<T, ID> repository;
    protected final DtoMapper dtoMapper;
    private final Class<T> entityClass;
    private final Class<DTO> dtoClass;

    protected CrudService(JpaRepository<T, ID> repository, DtoMapper dtoMapper,
                          Class<T> entityClass, Class<DTO> dtoClass) {
        this.repository = repository;
        this.dtoMapper = dtoMapper;
        this.entityClass = entityClass;
        this.dtoClass = dtoClass;
    }

    public List<DTO> findAll() {
        return dtoMapper.toDtoList(repository.findAll(), dtoClass);
    }

    public Optional<DTO> findById(ID id) {
        return repository.findById(id)
                .map(entity -> dtoMapper.toDto(entity, dtoClass));
    }

    public DTO save(DTO dto) {
        T entity = dtoMapper.toEntity(dto, entityClass);
        T saved = repository.save(entity);
        return dtoMapper.toDto(saved, dtoClass);
    }

    public DTO update(ID id, DTO dto) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Registro não encontrado para ID: " + id);
        }

        dto.setId(id);
        T entity = dtoMapper.toEntity(dto, entityClass);
        T saved = repository.save(entity);
        return dtoMapper.toDto(saved, dtoClass);
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    public boolean existsById(ID id) {
        return repository.existsById(id);
    }
}