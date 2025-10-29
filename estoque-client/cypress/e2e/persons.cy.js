/// <reference types="cypress" />

describe('Pessoas', () => {
    beforeEach(() => {
        cy.resetDatabase()
    })
    it('Deve cadastrar uma nova pessoa', () => {
        cy.login('cypress-user', 'user');
        cy.visit('/persons');
        cy.get('#btn-add-person').click();
        cy.get('#input-person-cpf').type('123.456.789-00');
        cy.get('#input-person-name').type('Nome da Pessoa');
        cy.get('#input-person-email').type('email@exemplo.com');
        cy.get('#btn-save-person').click();
        cy.get('#toast-1-title').should('contain', 'Pessoa criada com sucesso!');
        cy.get('#table-persons').should('contain', 'Nome da Pessoa');
    })

    it('Deve validar campos obrigatórios ao cadastrar pessoa', () => {
        cy.login('cypress-user', 'user');
        cy.visit('/persons');
        cy.get('#btn-add-person').click();
        cy.get('#btn-save-person').click();
        cy.get('#toast-1-title').should('contain', 'Preencha os campos obrigatórios');
        cy.get('#input-person-cpf').type('123.456.789-00');
        cy.get('#btn-save-person').click();
        cy.get('#toast-2-title').should('contain', 'Preencha os campos obrigatórios');
        cy.get('#input-person-name').type('Nome da Pessoa');
        cy.get('#btn-save-person').click();
        cy.get('#toast-3-title').should('contain', 'Pessoa criada com sucesso!');
        cy.get('#table-persons').should('contain', 'Nome da Pessoa');
    })

    it('Deve editar uma pessoa existente', () => {
        var id
        cy.login('cypress-user', 'user').then(() => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:8080/persons',
                body: {
                    cpf: '123.456.789-00',
                    name: 'Pessoa Original',
                    email: 'email@exemplo.com',
                    userId: 3
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${Cypress.env('token')}`
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                id = response.body.id;
            });
        }).then(() => {
            cy.visit('/persons');
            cy.get(`#btn-edit-person-${id}`).click();
            cy.get('#input-person-name').clear().type('Pessoa Editada');
            cy.get('#btn-save-person').click();
            cy.get('#toast-1-title').should('contain', 'Pessoa atualizada com sucesso!');
            cy.get('#table-persons').should('contain', 'Pessoa Editada');
        })
    })

    it('Deve excluir uma pessoa existente', () => {
        var id
        cy.login('cypress-user', 'user').then(() => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:8080/persons',
                body: {
                    cpf: '123.456.789-00',
                    name: 'Pessoa a Excluir',
                    email: 'email@exemplo.com',
                    userId: 3
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${Cypress.env('token')}`
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                id = response.body.id;
            })
        }).then(() => {
            cy.visit('/persons');
            cy.get('#table-persons').should('contain', 'Pessoa a Excluir');
            cy.get(`#btn-delete-person-${id}`).click();
            cy.get('#toast-1-title').should('contain', 'Pessoa excluída');
            cy.get('#table-persons').should('not.contain', 'Pessoa a Excluir');
        })
    })

    it.only('Deve realizar a busca de pessoas por Nome, CNPJ e Email', () => {
        cy.login('cypress-user', 'user').then(() => {
            const persons = [
                { cpf: '123.456.789-00', name: 'Alice Silva', email: 'alice@exemplo.com' },
                { cpf: '987.654.321-00', name: 'Bruno Souza', email: 'bruno@exemplo.com' }
            ];

            persons.forEach((person) => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/persons',
                    body: {
                        cpf: person.cpf,
                        name: person.name,
                        email: person.email,
                        userId: 3
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                });
            });
        }).then(() => {
            cy.visit('/persons');
            // Busca por Nome
            cy.get('#select-field').select('Nome');
            cy.get('#input-search').type('Alice Silva');
            cy.get('#table-persons').should('contain', 'Alice Silva');
            cy.get('#table-persons').should('not.contain', 'Bruno Souza');
            cy.get('#input-search').clear();

            // Busca por CPF
            cy.get('#select-field').select('CPF');
            cy.get('#input-search').clear().type('987.654.321-00');
            cy.get('#table-persons').should('contain', 'Bruno Souza');
            cy.get('#table-persons').should('not.contain', 'Alice Silva');
            cy.get('#input-search').clear();

            // Busca por Email
            cy.get('#select-field').select('Email');
            cy.get('#input-search').clear().type('bruno@exemplo.com');
            cy.get('#table-persons').should('contain', 'Bruno Souza');
            cy.get('#table-persons').should('not.contain', 'Alice Silva');
        })
    });
});