package br.edu.utfpr.estoque.shared;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class DtoMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public DtoMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public <D, E> D toDto(E entity, Class<D> dtoClass) {
        return modelMapper.map(entity, dtoClass);
    }

    public <D, E> E toEntity(D dto, Class<E> entityClass) {
        return modelMapper.map(dto, entityClass);
    }

    public <D, E> List<D> toDtoList(List<E> entities, Class<D> dtoClass) {
        return entities.stream()
                .map(entity -> toDto(entity, dtoClass))
                .collect(Collectors.toList());
    }

    public <D, E> List<E> toEntityList(List<D> dtos, Class<E> entityClass) {
        return dtos.stream()
                .map(dto -> toEntity(dto, entityClass))
                .collect(Collectors.toList());
    }
}