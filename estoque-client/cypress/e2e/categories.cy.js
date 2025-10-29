/// <reference types="cypress" />
describe('Categorias', () => {
    context('Admin - Categorias', () => {

        beforeEach(() => {
            cy.resetDatabase()
        })

        it('Deve criar uma nova categoria', () => {
            cy.login('cypress-admin', 'admin');
            cy.visit('/categories');
            cy.get('#btn-add-category').click();
            cy.get('#input-category-description').type('Categoria Teste');
            cy.get('#btn-save-category').click();
            cy.get('#table-categories').should('contain', 'Categoria Teste');
        })

        it('Deve editar uma categoria existente', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {

                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/categories',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    },
                    body: {
                        description: 'Categoria Antiga'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    id = response.body.id
                })
            });

            cy.visit('/categories');
            cy.get('#table-categories').contains('td', 'Categoria Antiga').parent('tr').within(() => {
                cy.get(`#btn-edit-category-${id}`).click();
            });
            cy.get('#input-category-description').clear().type('Categoria Atualizada');
            cy.get('#btn-save-category').click();
            cy.get('#table-categories').should('contain', 'Categoria Atualizada');
        })

        it('Deve excluir uma categoria existente', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/categories',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    },
                    body: {
                        description: 'Categoria para Excluir'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    id = response.body.id
                })
            })
            cy.visit('/categories');
            cy.get('#table-categories').contains('td', 'Categoria para Excluir').parent('tr').within(() => {
                cy.get(`#btn-delete-category-${id}`).click();
            });
            cy.get('#toast-1-title').should('contain', 'Categoria excluída');
            cy.get('#table-categories').should('not.contain', 'Categoria para Excluir');
        })

        it('Deve realizar a busca de uma categoria', () => {
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/categories',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    },
                    body: {
                        description: 'Categoria para Buscar'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                })
            })
            cy.visit('/categories');
            cy.get('#select-field').select('Descrição');
            cy.get('#input-search').type('Limpar tela').clear();
            cy.get('#input-search').type('Buscar');
            cy.get('#table-categories').should('contain', 'Categoria para Buscar');
        })
    })

    context('User - Categorias', () => {
        beforeEach(() => {
            cy.task('queryDatabase', 'DELETE FROM CATEGORY')
        })

        it.only('Deve visualizar a lista de categorias e verificar os campos bloqueados', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/categories',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    },
                    body: {
                        description: 'Categoria para usuario'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    id = response.body.id
                })
            })
            cy.login('cypress-user', 'user');
            cy.visit('/categories');
            cy.get('#table-categories').should('contain', 'Categoria para usuario');

            cy.get('#btn-add-category').should('be.disabled');
            cy.get('#table-categories').contains('td', 'Categoria para usuario').parent('tr').within(() => {
                cy.get(`#btn-edit-category-${id}`).should('be.disabled');
                cy.get(`#btn-delete-category-${id}`).should('be.disabled');
            });
        })
    })
})