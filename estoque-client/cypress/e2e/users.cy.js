/// <reference types="cypress" />

describe('Usuarios', () => {
    context('Admin - Usuarios', () => {
        beforeEach(() => {
            cy.resetDatabase()
        })

        it('Deve criar um novo usuário', () => {
            cy.task('queryDatabase', 'SELECT setval(\'app_user_id_seq\', (SELECT MAX(id) FROM "app_user") + 1);')

            cy.login('cypress-admin', 'admin');
            cy.visit('/users');
            cy.get('#button-add-user').click();
            cy.get('#input-name').type('Teste User');
            cy.get('#input-username').type('Teste User');
            cy.get('#input-password').type('userpass');
            cy.get('#select-role').select('ROLE_USER');
            cy.get('#btn-save-user').click();
            cy.get('#toast-1-title').should('contain', 'Usuário criado com sucesso!');
            cy.get('#table-users').should('contain', 'Teste User');
        });

        it('Deve editar um usuário existente', () => {
            cy.task('queryDatabase', 'SELECT setval(\'app_user_id_seq\', (SELECT MAX(id) FROM "app_user") + 1);')

            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/auth/register',
                    body: {
                        name: "Teste User",
                        username: "Teste User",
                        role: "ROLE_USER",
                        password: "userpass",
                        active: true
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
                cy.visit('/users');
                cy.get('#table-users').contains('Teste User').parent().find(`#btn-edit-user-${id}`).click();
                cy.get('#input-name').clear().type('Teste User Editado');
                cy.get('#input-username').clear().type('teste-user-editado');
                cy.get('#btn-save-user').click();
                cy.get('#toast-1-title').should('contain', 'Usuário atualizado com sucesso!');
                cy.get('#table-users').should('contain', 'Teste User Editado');
            });
        });

        it('Deve excluir um usuário existente', () => {
            cy.task('queryDatabase', 'SELECT setval(\'app_user_id_seq\', (SELECT MAX(id) FROM "app_user") + 1);')

            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/auth/register',
                    body: {
                        name: "Teste User",
                        username: "Teste User",
                        role: "ROLE_USER",
                        password: "userpass",
                        active: true
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
                cy.visit('/users');
                cy.get('#table-users').contains('Teste User').parent().find(`#btn-delete-user-${id}`).click();
                cy.get('#toast-1-title').should('contain', 'Usuário excluído');
                cy.get('#table-users').should('not.contain', 'Teste User');
            })
        })

        it('Deve permitir busca por Usuário, nome e função', () => {

            const users = [
                { name: "Teste User", username: "Teste Username", role: "ROLE_USER", password: "userpass" },
                { name: "Admin User", username: "Admin Username", role: "ROLE_ADMIN", password: "adminpass" }
            ];

            cy.login('cypress-admin', 'admin').then(() => {
                users.forEach(user => {
                    cy.request({
                        method: 'POST',
                        url: 'http://localhost:8080/auth/register',
                        body: {
                            name: user.name,
                            username: user.username,
                            role: user.role,
                            password: user.password,
                            active: true
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json, text/plain, */*',
                            'Authorization': `Bearer ${Cypress.env('token')}`,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                    });
                })
            }).then(() => {
                cy.visit('/users');
                // Busca por Usuário
                cy.get('#select-field').select('Usuário');
                cy.get('#input-search').type('Teste Username');
                cy.get('#table-users').should('contain', 'Teste Username');
                cy.get('#input-search').clear()
                // Busca por Nome
                cy.get('#select-field').select('Nome');
                cy.get('#input-search').type('Teste User');
                cy.get('#table-users').should('contain', 'Teste User');
                cy.get('#input-search').clear()
                // Busca por Função
                cy.get('#select-field').select('Função');
                cy.get('#input-search').type('USER');
                cy.get('#table-users').should('contain', 'Teste User');
                cy.get('#input-search').clear()
                cy.get('#input-search').type('ADMIN');
                cy.get('#table-users').should('contain', 'Admin Username');
            })
        })

        it('Deve validar campos obrigatórios ao criar usuário', () => {
            cy.login('cypress-admin', 'admin');
            cy.visit('/users');
            cy.get('#button-add-user').click();
            cy.get('#btn-save-user').click();
            cy.get('#toast-1-title').should('contain', 'Preencha os campos obrigatórios');
            cy.get('#input-name').type('Teste User');
            cy.get('#btn-save-user').click();
            cy.get('#toast-2-title').should('contain', 'Preencha os campos obrigatórios');
            cy.get('#input-username').type('testeuser');
            cy.get('#btn-save-user').click();
            cy.get('#toast-3-title').should('contain', 'A senha é obrigatória ao criar um novo usuário');
            cy.get('#input-password').type('userpass');
            cy.get('#btn-save-user').click();
            cy.get('#toast-4-title').should('contain', 'Usuário criado com sucesso!');
        })

        it('Deve alterar a senha de outro usuário e verificar a autenticação', () => {
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/auth/register',
                    body: {
                        name: "Teste User",
                        username: "testeuser",
                        role: "ROLE_USER",
                        password: "userpass",
                        active: true
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
                cy.visit('/users');
                cy.get('#table-users').contains('Teste User').parent().find(`#btn-password-user-${id}`).click();
                cy.get('#input-new-password').type('newuserpass');
                cy.get('#btn-confirm-password-user').click();
                cy.get('#toast-1-title').should('contain', 'Senha alterada com sucesso!');
            }).then(() => {
                cy.get('#button-logout').click();
                cy.login('testeuser', 'newuserpass');
                cy.get('#greeting-message').should('contain', 'Bem-vindo ao sistema de estoque');
            });
        });
    })


    context('User - Usuarios', () => {
        beforeEach(() => {
            cy.resetDatabase()
        })

        it('Deve bloquear as ações, permitindo somente a visualização dos registros', () => {
            cy.login('cypress-user', 'user');
            cy.visit('/users');
            cy.get('#button-add-user').should('be.disabled')
            cy.get('#btn-edit-user-1').should('be.disabled')
            cy.get('#btn-delete-user-1').should('be.disabled')
            cy.get('#btn-password-user-1').should('be.disabled')
        })

        it('Deve verificar que é possível editar a própria senha', () => {
            cy.task('queryDatabase', 'SELECT setval(\'app_user_id_seq\', (SELECT MAX(id) FROM "app_user") + 1);')
            var id
            cy.login('cypress-admin', 'admin').then(() => {
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:8080/auth/register',
                    body: {
                        name: "Cypress User test",
                        username: "cypress-user-test",
                        role: "ROLE_USER",
                        password: "user",
                        active: true
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${Cypress.env('token')}`,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    id = response.body.id;
                }).then(() => {
                    cy.login('cypress-user-test', 'user');
                    cy.visit('/users');
                    cy.get(`#btn-password-user-${id}`).click();
                    cy.get('#input-new-password').type('newuserpass');
                    cy.get('#btn-confirm-password-user').click();
                    cy.get('#toast-1-title').should('contain', 'Senha alterada com sucesso!');
                    cy.get('#button-logout').click();
                    cy.login('cypress-user-test', 'newuserpass');
                    cy.get('#greeting-message').should('contain', 'Bem-vindo ao sistema de estoque');
                })
            })

        })

    })

})  