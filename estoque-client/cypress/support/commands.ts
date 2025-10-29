/// <reference types="cypress" />

Cypress.Commands.add('login', (username, password) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/auth/login',
        body: { username, password },
    }).then((response) => {
        expect(response.status).to.eq(200)
        const { token, role, name, userId } = response.body

        Cypress.env('token', token)

        window.localStorage.setItem('token', token)
        window.localStorage.setItem('role', role)
        window.localStorage.setItem('user', JSON.stringify({ id: userId, name }))

        cy.visit('/')
    })
})

Cypress.Commands.add('resetDatabase', () => {
    cy.task('resetDatabase')
})