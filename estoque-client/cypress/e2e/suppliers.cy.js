/// <reference types="cypress" />

describe('Fornecedores', () => {
    context('Admin - Fornecedores', () => {

        beforeEach(() => {
            cy.resetDatabase()
        })

        it('Deve criar um novo fornecedor', () => {
            cy.login('cypress-admin', 'admin');
            cy.visit('/suppliers');
            cy.get('#btn-add-supplier').click();
            cy.get('#input-supplier-name').type('Fornecedor Teste');
            cy.get('#input-supplier-cnpj').type('12.345.678/0001-90');
            cy.get('#btn-save-supplier').click();
            cy.get('#toast-1-title').should('contain', 'Fornecedor criado com sucesso!');
            cy.get('#table-suppliers').should('contain', 'Fornecedor Teste');
        })

        it('Deve editar um fornecedor existente', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/suppliers',
                    body: {
                        name: 'Fornecedor Teste',
                        cnpj: '12.345.678/0001-90',
                        userId: 2
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    id = response.body.id;
                });
            }).then(() => {
                cy.visit('/suppliers');
                cy.get(`#btn-edit-supplier-${id}`).click();
                cy.get('#input-supplier-name').clear().type('Fornecedor Teste Editado');
                cy.get('#input-supplier-cnpj').clear().type('98.765.432/0001-09');
                cy.get('#btn-save-supplier').click();
                cy.get('#toast-1-title').should('contain', 'Fornecedor atualizado com sucesso!');
                cy.get('#table-suppliers').should('contain', 'Fornecedor Teste Editado');
            })
        })

        it('Deve excluir um fornecedor existente', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/suppliers',
                    body: {
                        name: 'Fornecedor Teste',
                        cnpj: '12.345.678/0001-90',
                        userId: 2
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    id = response.body.id;
                });
            }).then(() => {
                cy.visit('/suppliers');
                cy.get(`#btn-delete-supplier-${id}`).click();
                cy.get('#toast-1-title').should('contain', 'Fornecedor excluído');
                cy.get('#table-suppliers').should('not.contain', 'Fornecedor Teste');
            })
        })

        it('Deve validar campos obrigatórios ao criar fornecedor', () => {
            cy.login('cypress-admin', 'admin');
            cy.visit('/suppliers');
            cy.get('#btn-add-supplier').click();
            cy.get('#btn-save-supplier').click();
            cy.get('#toast-1-title').should('contain', 'Preencha os campos obrigatórios');
            cy.get('#input-supplier-name').type('Fornecedor Teste');
            cy.get('#btn-save-supplier').click();
            cy.get('#toast-2-title').should('contain', 'Preencha os campos obrigatórios');
            cy.get('#input-supplier-cnpj').type('12.345.678/0001-90');
            cy.get('#btn-save-supplier').click();
            cy.get('#toast-3-title').should('contain', 'Fornecedor criado com sucesso!');
        });

        it('Deve realizar a busca de fornecedores por Nome e CNPJ', () => {
            cy.login('cypress-admin', 'admin').then(() => {
                const suppliers = [
                    { name: 'Fornecedor Alpha', cnpj: '11.111.111/0001-11' },
                    { name: 'Fornecedor Beta', cnpj: '22.222.222/0001-22' },
                    { name: 'Fornecedor Gamma', cnpj: '33.333.333/0001-33' }
                ];
                suppliers.forEach((supplier) => {
                    cy.request({
                        method: 'POST',
                        url: 'http://localhost:8080/suppliers',
                        body: {
                            name: supplier.name,
                            cnpj: supplier.cnpj,
                            userId: 2
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json, text/plain, */*',
                            'Authorization': `Bearer ${Cypress.env('token')}`,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                    });
                });
            }).then(() => {
                cy.visit('/suppliers');

                // Busca por Nome
                cy.get('#select-field').select('Nome');
                cy.get('#input-search').type('Beta');
                cy.get('#table-suppliers').should('contain', 'Fornecedor Beta');
                cy.get('#table-suppliers').should('not.contain', 'Fornecedor Alpha');
                cy.get('#table-suppliers').should('not.contain', 'Fornecedor Gamma');
                cy.get('#input-search').clear();

                // Busca por CNPJ
                cy.get('#select-field').select('CNPJ');
                cy.get('#input-search').type('33.333.333/0001-33');
                cy.get('#table-suppliers').should('contain', 'Fornecedor Gamma');
                cy.get('#table-suppliers').should('not.contain', 'Fornecedor Alpha');
                cy.get('#table-suppliers').should('not.contain', 'Fornecedor Beta');
            })
        })
    })

    context('User - Fornecedores', () => {

        beforeEach(() => {
            cy.resetDatabase()
        })

        it('Deve visualizar a lista de fornecedores e verificar os campos bloqueados', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/suppliers',
                    body: {
                        name: 'Fornecedor Teste',
                        cnpj: '12.345.678/0001-90',
                        userId: 2
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    id = response.body.id
                })
            })
            cy.login('cypress-user', 'user');
            cy.visit('/suppliers');
            cy.get('#table-suppliers').should('contain', 'Fornecedor Teste');
            cy.get('#btn-add-supplier').should('be.disabled');
            cy.get('#table-suppliers').contains('td', 'Fornecedor Teste').parent('tr').within(() => {
                cy.get(`#btn-edit-supplier-${id}`).should('be.disabled');
                cy.get(`#btn-delete-supplier-${id}`).should('be.disabled');
            });
        })
    })
})