package br.edu.utfpr.estoque.service;

import br.edu.utfpr.estoque.dto.SupplierDTO;
import br.edu.utfpr.estoque.model.Supplier;
import br.edu.utfpr.estoque.model.User;
import br.edu.utfpr.estoque.repository.SupplierRepository;
import br.edu.utfpr.estoque.repository.UserRepository;
import br.edu.utfpr.estoque.shared.CrudService;
import br.edu.utfpr.estoque.shared.DtoMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupplierService extends CrudService<Supplier, SupplierDTO, Long> {

    private final UserRepository userRepository;

    @Autowired
    public SupplierService(SupplierRepository repository, DtoMapper dtoMapper, UserRepository userRepository) {
        super(repository, dtoMapper, Supplier.class, SupplierDTO.class);
        this.userRepository = userRepository;
    }

    @Override
    public SupplierDTO save(SupplierDTO dto) {
        Supplier supplier = dtoMapper.toEntity(dto, Supplier.class);

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            supplier.setUser(user);
        } else {
            throw new IllegalArgumentException("O identificador do usuário é obrigatório.");
        }

        Supplier saved = repository.save(supplier);
        return dtoMapper.toDto(saved, SupplierDTO.class);
    }
}