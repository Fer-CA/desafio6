import db from "../database/db_connect.js"
import bcrypt from "bcrypt"

export const registrarUsuario = async ({ email, password, rol, lenguage }) => {
    const consulta = "INSERT INTO usuarios (id, email, password, rol, lenguage) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *;"
    const passwordEncriptada = await bcrypt.hash(password, 10)
    const values = [email, passwordEncriptada, rol, lenguage]
    const { rowCount } = await db(consulta, values)
    if (!rowCount) {
        const newError = { code: 500, message: "No se pudo crear el registro" }
        throw newError
    }
}

export const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1;"
    const values = [email]
    const { rows: [usuario], rowCount } = await db(consulta, values)
    if (!rowCount) {
        const newError = { code: 401, message: "email o contraseña incorrecta" }
        throw newError
    }
    const passwordEncriptada = usuario.password
    const passwordCorrecta = await bcrypt.compare(password, passwordEncriptada)
    if (!passwordCorrecta) {
        const newError = { code: 401, message: "email o contraseña incorrecta" }
        throw newError
    }
}

export const getUser = async (email) => {
    try {
        const consulta = "SELECT email, rol, lenguage FROM usuarios WHERE email = $1;"
        const values = [email]
        const { rows } = await db(consulta, values)
        return rows
    } catch (error) {
        const newError = { code:500, message: error }
        throw newError
    }
}