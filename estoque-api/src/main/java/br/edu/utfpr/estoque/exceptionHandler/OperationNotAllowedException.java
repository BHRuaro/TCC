package br.edu.utfpr.estoque.exceptionHandler;

public class OperationNotAllowedException extends RuntimeException {
    public OperationNotAllowedException(String message) {
        super(message);
    }
}