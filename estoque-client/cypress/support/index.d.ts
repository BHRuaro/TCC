/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        login(username: string, password: string): Chainable<null>
    }
    interface Chainable {
        resetDb(): Chainable<void>
    }
}

