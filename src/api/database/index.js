const { Pool } = require('pg'), // Nos permite la conexión con la base de datos PostgresSQL.

pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DATABASEPORT
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}