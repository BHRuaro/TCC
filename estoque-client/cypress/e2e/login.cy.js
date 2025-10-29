/// <reference types="cypress" />

describe('Testes de Autenticação', () => {

    it('Deve fazer login com credenciais válidas', () => {
        cy.visit('/login')
        cy.get('#input-username').type('cypress-admin')
        cy.get('#input-password').type('admin')
        cy.intercept('POST', '/auth/login').as('loginRequest')
        cy.get('#button-login').click()
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200).then(() => {
            cy.get('#greeting-message').should('be.visible').and('contain', 'Bem-vindo ao sistema de estoque')
        })
    })

    it('Deve exibir mensagem de erro com credenciais inválidas', () => {
        cy.visit('/login')
        cy.get('#input-username').type('invalid-user')
        cy.get('#input-password').type('wrong-password')
        cy.intercept('POST', '/auth/login').as('loginRequest')
        cy.get('#button-login').click()

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401).then(() => {
            cy.get('#toast-error-message').should('be.visible').and('contain', 'Usuário inexistente ou senha inválida')
        })
    })

    it('Deve limpar Local Storage ao fazer logout', () => {
        cy.visit('/login')
        cy.get('#input-username').type('cypress-admin')
        cy.get('#input-password').type('admin')
        cy.intercept('POST', '/auth/login').as('loginRequest')
        cy.get('#button-login').click()
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200).then(() => {
            cy.get('#greeting-message').should('be.visible').and('contain', 'Bem-vindo ao sistema de estoque')
        })

        cy.get('#button-logout').click()
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null
            expect(win.localStorage.getItem('role')).to.be.null
            expect(win.localStorage.getItem('user')).to.be.null
        })
    })

})