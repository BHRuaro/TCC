package br.edu.utfpr.estoque.shared;

public interface Identifiable<T>{

    T getId();

    void setId(T id);
}
