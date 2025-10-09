package br.edu.utfpr.estoque.security.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String username;
    private String password;
}