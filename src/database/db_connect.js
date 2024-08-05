import pg from "pg"

const { Pool } = pg

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    allowExitOnIdle: true
})

const db = (consulta, values) => 
    pool.query(consulta, values)
        .then(({ rows }) => rows)
        .catch(({ code, message}) => {
            const error = { code, message }
            throw error
        })
export default db