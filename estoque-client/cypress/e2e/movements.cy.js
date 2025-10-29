/// <reference types="cypress" />

describe('Movimentações', () => {

    context('CRUD de Movimentações', () => {
        beforeEach(() => {
            cy.resetDatabase();
        })

        it('Deve criar uma movimentação de ENTRADA', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 0, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user');
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();

            cy.get('#select-movement-type').select('Entrada');
            cy.get('#select-supplier').select('1 - Fornecedor X');
            cy.get('#input-movement-observation').type('Observação de teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('5');

            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Movimentação registrada');
        })

        it('Deve criar uma movimentação de SAÍDA', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa teste\');')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user');
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa teste');
            cy.get('#input-movement-observation').type('Observação de teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('5');

            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Movimentação registrada');
        })

        it('Deve verificar os detalhes de uma movimentação', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa teste\');')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            var id

            cy.login('cypress-user', 'user').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/movements/create',
                    body: {
                        type: "SAIDA",
                        dateTime: "2025-10-29T02:29:53.726Z",
                        userId: 3,
                        observation: "Observação de teste",
                        supplierId: null,
                        personId: 1,
                        itemMovements: [
                            {
                                itemId: 1,
                                quantity: 5
                            }
                        ]
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    id = response.body.movement.id;
                })
            }).then(() => {
                cy.visit('/movements');
                cy.get(`#btn-view-movement-${id}`).click();
                cy.get('#modal-body-movements-details').should('contain', 'SAIDA');
                cy.get('#modal-body-movements-details').should('contain', 'Pessoa teste');
                cy.get('#modal-body-movements-details').should('contain', 'Observação de teste');
                cy.get('#modal-body-movements-details').should('contain', 'Item teste');
                cy.get('#modal-body-movements-details').should('contain', '5');
            })
        })

        context('Regras de Negócio', () => {
        })
    })
})