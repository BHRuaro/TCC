# 📦 Sistema de Gerenciamento de Estoque com Testes Automatizados

> **Trabalho de Conclusão de Curso (TCC)** — Tecnologia em Análise e Desenvolvimento de Sistemas  
> **Universidade Tecnológica Federal do Paraná (UTFPR) - Campus Pato Branco**  
> Autor: **Bruno Henrique Leão Ruaro**

---

## 🧭 Visão Geral

Este projeto foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC), com o objetivo de criar um **sistema web para gerenciamento de estoque**, voltado a pequenas empresas que desejam **substituir o controle manual de produtos** por uma solução moderna, automatizada e confiável.

O sistema foi **projetado e implementado utilizando boas práticas de desenvolvimento**, cobertura de **testes automatizados** e uma arquitetura organizada entre **back-end (Java + Spring Boot)** e **front-end (React + TypeScript)**.

---

## 🧱 Arquitetura do Projeto

A aplicação foi dividida em dois módulos principais:

tcc/
├── estoque-api # Back-end (Spring Boot + PostgreSQL)
└── estoque-client # Front-end (React + TypeScript + Chakra UI)


---

## ⚙️ Tecnologias Utilizadas

| Camada | Ferramenta / Tecnologia | Versão | Finalidade |
|--------|--------------------------|---------|-------------|
| **Back-end** | Java | 21 | Linguagem de programação |
| | Spring Boot | 3.5.6 | Framework principal do servidor |
| | Hibernate / JPA | - | Mapeamento objeto-relacional |
| | PostgreSQL | 16 | Banco de dados relacional |
| | DBeaver | 24 | Gerenciador de banco de dados |
| **Front-end** | React | 18.3.1 | Interface do usuário |
| | TypeScript | 5.7 | JavaScript com tipagem estática |
| | Chakra UI | - | Biblioteca de componentes estilizados |
| **Testes e Qualidade** | Cypress | 13.16.1 | Testes automatizados de interface |
| | Allure Report | 2.35.1 | Relatórios visuais de testes |
| **IDE e Ambientes** | IntelliJ IDEA | 2023.3 | Desenvolvimento back-end |
| | Visual Studio Code | 1.104.3 | Desenvolvimento front-end |

---

## 🧩 Funcionalidades Principais

✅ Cadastro e gerenciamento de **pessoas** (destinatários dos produtos)  
✅ Cadastro e controle de **usuários do sistema** (administradores e operadores)  
✅ Registro de **produtos**, **categorias** e **fornecedores**  
✅ Movimentações de **entrada e saída de estoque**  
✅ Controle de **quantidades disponíveis** e **histórico de movimentações**  
✅ Autenticação com **JWT (JSON Web Token)**  
✅ Cobertura de **testes automatizados** de interface (Cypress)  
✅ Geração de **relatórios e dashboards** simplificados  

---

## 🧠 Estrutura e Modelagem

O sistema foi **modelado previamente**, incluindo **casos de uso**, **diagramas de classes** e **relacionamentos entre entidades**.  
A modelagem contempla as principais tabelas:

- **Pessoa**  
- **Usuário**  
- **Produto**  
- **Categoria**  
- **Fornecedor (Supplier)**  
- **Movimentação** *(Entrada e Saída)*  

---

## 🔒 Segurança

A autenticação é realizada através de **JWT**, garantindo que apenas usuários autenticados possam acessar recursos protegidos.  
O Spring Security gerencia as permissões e o controle de acesso entre rotas.

---

## 🧪 Testes Automatizados

Os testes de interface foram implementados com **Cypress**, simulando o uso real do sistema.  
O **Allure Report** é utilizado para geração de relatórios detalhados com gráficos e evidências dos testes executados.

Principais cenários testados:
- Login e autenticação  
- Cadastro e edição de produtos  
- Movimentação de estoque  
- Validação de formulários e mensagens de erro  

---

## 🗃️ Banco de Dados

O sistema utiliza o **PostgreSQL** com configuração via **application.yaml**.  
Durante o desenvolvimento, a estratégia `ddl-auto: create-drop` é usada para recriar as tabelas automaticamente a cada execução.

---

## 🚀 Execução do Projeto

### Back-end (Spring Boot)
asd
```bash
cd estoque-api
./mvnw spring-boot:run
```

### Front-end (React)

```bash
cd estoque-client
npm install
npm start
```

A aplicação será executada em:
API: http://localhost:8080
Front-end: http://localhost:3000

### 📁 Estrutura de Pastas

```bash
estoque-api/
 ├── src/main/java/br/edu/utfpr/estoque
 │   ├── config/
 │   ├── controller/
 │   ├── dto/
 │   ├── model/
 │   ├── repository/
 │   ├── security/
 │   ├── service/
 │   ├── shared/
 │   ├── spec/
 │   └── EstoqueApplication.java
 │
 └── src/main/resources/
     └── application.yaml

estoque-client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── hooks/
└── package.json
```

### 🧾 Estrutura de Testes
```
cypress/
├── e2e/
 │   ├── login.cy.js
 │   ├── produtos.cy.js
 │   └── movimentacoes.cy.js
 ├── reports/
 │   └── allure-results/
 └── support/
     └── commands.js
```
---

## 👨‍💻 Autor

**Bruno Henrique Leão Ruaro**  
Estudante de **Análise e Desenvolvimento de Sistemas** pela **UTFPR**.  
Apaixonado por desenvolvimento de software, automação e tecnologias que aumentam a eficiência e a produtividade.

📧 **Email:** [bruno-ruaro@hotmail.com](mailto:bruno-ruaro@hotmail.com)  
💼 **LinkedIn:** [linkedin.com/in/bruno-ruaro](https://www.linkedin.com/in/bruno-ruaro)

---

## ⚖️ Licença

Este projeto foi desenvolvido **para fins acadêmicos** como parte do Trabalho de Conclusão de Curso (TCC).  
O código e o conteúdo podem ser utilizados livremente **para estudo e aprendizado**.

© 2025 — **Bruno Henrique Leão Ruaro**  
Todos os direitos reservados.
---

⭐ *Se este projeto te ajudou de alguma forma, considere deixar uma estrela no repositório!*

---
