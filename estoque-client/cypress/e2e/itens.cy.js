const { header } = require("framer-motion/client")

describe('Itens', () => {
    beforeEach(() => {
        cy.resetDatabase()

    })

    it('Deve cadastrar um novo item', () => {
        cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria Teste\')')
        cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor teste\', \'99.999.999/9999-99\')')

        cy.login('cypress-user', 'user');
        cy.visit('/items');
        cy.get('#btn-add-item').click();
        cy.get('#input-item-name').type('Nome do Item');
        cy.get('#input-item-description').type('Descrição do item');
        cy.get('#select-item-category').select('1 - Categoria Teste');
        cy.get('#select-item-supplier').select('1 - Fornecedor teste');
        cy.get('#btn-save-item').click();
        cy.get('#table-items').should('contain', 'Nome do Item');
    })

    it('Deve validar campos obrigatórios ao cadastrar item', () => {
        cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria Teste\')')
        cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor teste\', \'99.999.999/9999-99\')')

        cy.login('cypress-user', 'user');
        cy.visit('/items');
        cy.get('#btn-add-item').click();
        cy.get('#btn-save-item').click();

        cy.get('#toast-1-title').should('contain', 'Informe o nome do item');
        cy.get('#input-item-name').type('Nome do Item');

        cy.get('#btn-save-item').click();

        cy.get('#toast-2-title').should('contain', 'Selecione uma categoria e um fornecedor');
        cy.get('#select-item-category').select('1 - Categoria Teste');
        cy.get('#btn-save-item').click();

        cy.get('#toast-3-title').should('contain', 'Selecione uma categoria e um fornecedor');
        cy.get('#select-item-supplier').select('1 - Fornecedor teste');
        cy.get('#btn-save-item').click();

        cy.get('#toast-4-title').should('contain', 'Item criado com sucesso!');
    })

    it('Deve editar um item existente', () => {
        cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria Teste\')')
        cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor teste\', \'99.999.999/9999-99\')')

        var id

        cy.login('cypress-user', 'user').then(() => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:8080/items',
                body: {
                    name: "Item teste",
                    description: "Descricao teste",
                    unitPrice: 9.99,
                    stockQuantity: 10,
                    minStockQuantity: 5,
                    movementLimit: 5,
                    expirationDate: "2025-12-31",
                    categoryId: 1,
                    supplierId: 1,
                    userId: 3
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${Cypress.env('token')}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(200)
                id = response.body.id
            })
        }).then(() => {


            cy.visit('/items');
            cy.get('#table-items').should('contain', 'Item teste');
            cy.get(`#btn-edit-item-${id}`).click();
            cy.get('#input-item-name').clear().type('Item teste editado');
            cy.get('#input-item-unitprice').clear().type('19.99');
            cy.get('#input-item-stock').clear().type('20');
            cy.get('#btn-save-item').click();
            cy.get('#toast-1-title').should('contain', 'Item atualizado com sucesso!');
            cy.get('#table-items').should('contain', 'Item teste editado');

            cy.get(`#row-item-${id}`).should('contain', 'Item teste editado');
            cy.get(`#row-item-${id}`).should('contain', '19.99');
            cy.get(`#row-item-${id}`).should('contain', '20');
        })
    })

    it('Deve excluir um item existente', () => {
        cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria Teste\')')
        cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor teste\', \'99.999.999/9999-99\')')

        var id

        cy.login('cypress-user', 'user').then(() => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:8080/items',
                body: {
                    name: "Item teste",
                    description: "Descricao teste",
                    unitPrice: 9.99,
                    stockQuantity: 10,
                    minStockQuantity: 5,
                    movementLimit: 5,
                    expirationDate: "2025-12-31",
                    categoryId: 1,
                    supplierId: 1,
                    userId: 3
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${Cypress.env('token')}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(200)
                id = response.body.id
            })
        }).then(() => {
            cy.visit('/items');
            cy.get('#table-items').should('contain', 'Item teste');
            cy.get(`#btn-delete-item-${id}`).click();
            cy.get('#toast-1-title').should('contain', 'Item excluído');
            cy.get('#table-items').should('not.contain', 'Item teste');
        })
    })

    it.only('Deve buscar itens pelo nome, descrição, categoria e fornecedor', () => {
        cy.task('queryDatabase', 'INSERT INTO CATEGORY (id, description) VALUES (1, \'Categoria A\'), (2, \'Categoria B\')')
        cy.task('queryDatabase', 'INSERT INTO supplier (id, user_id, "name", cnpj) VALUES(1, 1, \'Fornecedor X\', \'99.999.999/9999-99\'), (2, 1, \'Fornecedor Y\', \'88.888.888/8888-88\')')
        const items = [
            { name: 'Item Alpha', description: 'Descricao do Item Alpha', category: '1', supplier: '1' },
            { name: 'Item Beta', description: 'Descricao do Item Beta', category: '2', supplier: '2' },
            { name: 'Item Gamma', description: 'Descricao do Item Gamma', category: '1', supplier: '2' },
        ];

        cy.login('cypress-user', 'user').then(() => {
            items.forEach((item) => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/items',
                    body: {
                        name: item.name,
                        description: item.description,
                        unitPrice: 9.99,
                        stockQuantity: 10,
                        minStockQuantity: 5,
                        movementLimit: 5,
                        expirationDate: "2025-12-31",
                        categoryId: item.category,
                        supplierId: item.supplier,
                        userId: 3
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                });
            })
        }).then(() => {
            cy.visit('/items');

            // Buscar por nome
            cy.get('#select-field').select('Nome');
            cy.get('#input-search').type('Alpha');
            cy.get('#table-items').should('contain', 'Item Alpha');
            cy.get('#table-items').should('not.contain', 'Item Beta');
            cy.get('#table-items').should('not.contain', 'Item Gamma');

            // Buscar por descrição
            cy.get('#select-field').select('Descrição');
            cy.get('#input-search').clear().type('Descricao do Item Beta');
            cy.get('#table-items').should('contain', 'Item Beta');
            cy.get('#table-items').should('not.contain', 'Item Alpha');
            cy.get('#table-items').should('not.contain', 'Item Gamma');

            // Buscar por categoria
            cy.get('#select-field').select('Categoria');
            cy.get('#input-search').clear().type('Categoria A');
            cy.get('#table-items').should('contain', 'Item Alpha');
            cy.get('#table-items').should('contain', 'Item Gamma');
            cy.get('#table-items').should('not.contain', 'Item Beta');

            // Buscar por fornecedor
            cy.get('#select-field').select('Fornecedor');
            cy.get('#input-search').clear().type('Fornecedor Y');
            cy.get('#table-items').should('contain', 'Item Beta');
            cy.get('#table-items').should('contain', 'Item Gamma');
            cy.get('#table-items').should('not.contain', 'Item Alpha');

        })
    })
})