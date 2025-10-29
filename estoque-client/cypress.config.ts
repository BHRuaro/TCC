import { defineConfig } from "cypress"
import { Client } from "pg"
import { resetDatabase } from './cypress/support/scripts'
import allureWriter from "@shelex/cypress-allure-plugin/writer"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      token: "",
    },
    setupNodeEvents(on, config) {
      allureWriter(on, config)
      on("task", {
        async queryDatabase(query: string) {
          const client = new Client({
            host: "localhost",
            user: "postgres",
            password: "admin",
            database: "tcc_tests",
            port: 5432,
          })

          await client.connect()
          const result = await client.query(query)
          await client.end()
          return result.rows
        },
        resetDatabase() {
          return resetDatabase()
        }
      })

      return config
    },
  },
  env: {
    allureReuseAfterSpec: true,
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
})
