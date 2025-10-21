package br.edu.utfpr.estoque.exceptionHandler;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Recurso não encontrado",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Requisição inválida",
                ex.getMessage()
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno no servidor",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(OperationNotAllowedException.class)
    public ResponseEntity<ErrorResponse> handleOperationNotAllowed(OperationNotAllowedException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.METHOD_NOT_ALLOWED.value(),
                "Operação não permitida",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "Violação de integridade de dados.";

        String lowerMsg = ex.getMostSpecificCause().getMessage().toLowerCase();

        if (lowerMsg.contains("foreign key")) {
            message = "Não é possível excluir este registro pois ele está sendo utilizado em outro lugar.";
        } else if (lowerMsg.contains("value too long") || lowerMsg.contains("data too long")) {
            message = "Um dos campos excede o tamanho máximo permitido.";
        }else if (lowerMsg.contains("uk_supplier_cnpj")) {
            message = "Já existe um fornecedor com esse CNPJ cadastrado.";
        } else if (lowerMsg.contains("uk_person_cpf")) {
            message = "Já existe uma pessoa com esse CPF cadastrado.";
        } else if (lowerMsg.contains("unique constraint") || lowerMsg.contains("duplicate key")) {
            message = "Já existe um registro com esse valor. Verifique campos únicos.";
        }

        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Violação de integridade referencial",
                message
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Erro de validação nos campos.");

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação",
                message
        );

        return ResponseEntity.badRequest().body(error);
    }
}
