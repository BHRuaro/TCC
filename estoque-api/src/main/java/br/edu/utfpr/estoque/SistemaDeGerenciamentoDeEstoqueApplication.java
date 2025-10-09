package br.edu.utfpr.estoque;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(value = {"br.edu.utfpr.estoque.repository", "br.edu.utfpr.estoque.spec"})
@EntityScan("br.edu.utfpr.estoque.model")
public class SistemaDeGerenciamentoDeEstoqueApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaDeGerenciamentoDeEstoqueApplication.class, args);
	}

}
