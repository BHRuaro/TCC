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

        it(('Deve consistir os campos obrigatórios ao criar uma movimentação'), () => {

            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa teste\');')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user');
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Selecione o tipo de movimentação');
            cy.get('#select-movement-type').select('Saída');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-2-title').should('contain', 'Selecione a pessoa');
            cy.get('#select-person').select('1 - Pessoa teste');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-3-title').should('contain', 'Informe os itens e quantidades');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-4-title').should('contain', 'Informe os itens e quantidades');
            cy.get('#input-quantity-0').type('5');
            cy.get('#btn-save-movement').click();

            cy.get('#toast-5-title').should('contain', 'Movimentação registrada');
        })

        it('Deve registar corretamente o usuário que realizou a movimentação', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 0, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')
            var id;

            cy.login('cypress-user', 'user').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/movements/create',
                    body: {
                        type: "ENTRADA",
                        dateTime: "2025-10-29T02:29:53.726Z",
                        userId: 3,
                        observation: "Observação de teste",
                        supplierId: 1,
                        personId: null,
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
                cy.get('#modal-body-movements-details').should('contain', ' 3 - Cypress');
            })

            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/movements/create',
                    body: {
                        type: "ENTRADA",
                        dateTime: "2025-10-29T02:29:53.726Z",
                        userId: 2,
                        observation: "Observação de teste",
                        supplierId: 1,
                        personId: null,
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
                cy.get('#modal-body-movements-details').should('contain', ' 2 - Cypress');
            })
        })
    })
    context('Regras de Negócio', () => {

        beforeEach(() => {
            cy.resetDatabase();
        })

        it('Deve atualizar corretamente o estoque dos itens ao criar uma movimentação de ENTRADA', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 0, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 10, 9.99, 1, 2, 1, 3, \'Descricao teste 2\', \'Item teste 2\');')

            cy.login('cypress-user', 'user');

            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Entrada');
            cy.get('#select-supplier').select('1 - Fornecedor X');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('5');
            cy.get('#btn-add-item').click();
            cy.get('#select-item-1').select('2 - Item teste 2');
            cy.get('#input-quantity-1').type('10');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Movimentação registrada');

            cy.visit('/items');
            cy.get('#table-items tbody tr').first().within(() => {
                cy.get('td').eq(1).should('contain', 'Item teste');
                cy.get('td').eq(3).should('contain', '5');
            });
            cy.get('#table-items tbody tr').eq(1).within(() => {
                cy.get('td').eq(1).should('contain', 'Item teste 2');
                cy.get('td').eq(3).should('contain', '20');
            });
        })

        it('Deve atualizar corretamente o estoque dos itens ao criar uma movimentação de SAÍDA', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 0, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 0, 30, 9.99, 1, 2, 1, 3, \'Descricao teste 2\', \'Item teste 2\');')

            cy.login('cypress-user', 'user')

            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('5');
            cy.get('#btn-add-item').click();
            cy.get('#select-item-1').select('2 - Item teste 2');
            cy.get('#input-quantity-1').type('10');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Movimentação registrada');
            cy.visit('/items');
            cy.get('#table-items tbody tr').first().within(() => {
                cy.get('td').eq(1).should('contain', 'Item teste');
                cy.get('td').eq(3).should('contain', '15');
            });
            cy.get('#table-items tbody tr').eq(1).within(() => {
                cy.get('td').eq(1).should('contain', 'Item teste 2');
                cy.get('td').eq(3).should('contain', '20');
            });
        })

        it('Deve impedir a movimentação para quantidade inválida', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 0, 0, 5, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user')
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('-5');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1').should('contain', 'A quantidade deve ser maior que zero.');
            cy.get('#input-quantity-0').clear().type('0');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-2').should('contain', 'Informe os itens e quantidades');
            cy.get('#input-quantity-0').invoke('val', '').type('5');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-3-title').should('contain', 'Movimentação registrada');

        })

        it('Deve impedir a movimentação de SAÍDA quando o estoque for insuficiente', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 0, 0, 5, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user')
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('10');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1').should('contain', 'Estoque insuficiente para o item: Item teste');
        })

        it('Deve impedir a movimentação que ultrapasse o limite de movimentação do item', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 6, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user')
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('10');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1').should('contain', 'A quantidade (10) excede o limite de movimentação definido para o item: Item teste');
        })

        it('Deve exibir aviso quando o estoque ficar abaixo do mínimo após uma movimentação de SAÍDA', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 0, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user')
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('15');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Movimentação registrada');
            cy.get('#toast-2').should('contain', 'Atenção: o estoque do item \'Item teste\' ficou abaixo do mínimo (10).');
        })

        it('Deve impredir movimentação de itens expirados', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2025-12-31\', 10, 0, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user')
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('15');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1-title').should('contain', 'Movimentação registrada');
            cy.get('#toast-2').should('contain', 'Atenção: o estoque do item \'Item teste\' ficou abaixo do mínimo (10).');
        })

        it('Deve impedir movimentação de itens expirados', () => {
            cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\')')
            cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\')')
            cy.task('queryDatabase', 'INSERT INTO person (id, user_id, cpf, email, "name") VALUES(1, 3, \'123.456.789-10\', \'pessoa@teste.com\', \'Pessoa Teste\')')
            cy.task('queryDatabase', 'INSERT INTO item (expiration_date, min_stock_quantity, movement_limit, stock_quantity, unit_price, category_id, item_id, supplier_id, user_id, description, "name") VALUES(\'2020-12-31\', 10, 0, 20, 9.99, 1, 1, 1, 3, \'Descricao teste\', \'Item teste\');')

            cy.login('cypress-user', 'user')
            cy.visit('/movements');
            cy.get('#btn-new-movement').click();
            cy.get('#select-movement-type').select('Saída');
            cy.get('#select-person').select('1 - Pessoa Teste');
            cy.get('#select-item-0').select('1 - Item teste');
            cy.get('#input-quantity-0').type('5');
            cy.get('#btn-save-movement').click();
            cy.get('#toast-1').should('contain', 'O item \'Item teste\' está com a data de validade vencida.');
        })
    })
})