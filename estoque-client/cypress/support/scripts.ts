import { Client } from 'pg'

export async function resetDatabase() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'admin',
        database: 'tcc_tests',
    })

    await client.connect()

    await client.query('DELETE FROM item_movement')
    await client.query('DELETE FROM movement')
    await client.query('DELETE FROM item')
    await client.query('DELETE FROM category')
    await client.query('DELETE FROM supplier')
    await client.query('DELETE FROM person')

    await client.query('DELETE FROM app_user WHERE id NOT IN (1, 2, 3)')

    await client.end()

    return null
}
