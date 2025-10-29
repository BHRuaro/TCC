/// <reference types="cypress" />

describe('Home Page', () => {
    it("Deve verificar nome do usuario, links funcionais e mensagem de boas-vindas", () => {
        cy.login("cypress-admin", "admin");
        cy.visit("/");
        cy.get("#hello-user").should("contain", "Olá, Cypress");

        cy.get('#nav-inicio')
        cy.get('#nav-movimentacoes')
        cy.get('#nav-itens')
        cy.get('#nav-categorias')
        cy.get('#nav-pessoas')
        cy.get('#nav-fornecedores')
        cy.get('#nav-usuarios')

        cy.get('#greeting-message')

    })

})