package br.edu.utfpr.estoque.dto;

import lombok.Data;

@Data
public class UserCreateDTO {
    private String name;
    private String username;
    private String password;
    private String role;
    private Boolean active;
}