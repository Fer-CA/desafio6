import express from "express"
import morgan from "morgan"
import cors from "cors"
import { verificarCredenciales, registrarUsuario, getUser } from "../models/models.user.js"
import { jwtDecode, jwtSing } from "../utils/auth/jwt.js"
import { authToken } from "../middlewares/auth.middleware.js"

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwtSing({ email })
        res.status(200).json({ token })
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.post("/usuarios", async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body
        await registrarUsuario({ email, password, rol, lenguage })
        res.status(201).json({ status: true, message: "Usuario ingresado con éxito" })
    } catch (error) {
        res.status(error.code || 500).json({ message: "Error en la conexión", error })
    }
})

app.get("/usuarios", authToken, async (req, res) => {
    try {
        const authorization = req.header("Authorization")
        const [, token] = authorization.split(" ")
        const { email } = jwtDecode(token)
        const user = await getUser(email)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

app.all("*", (_, res) =>{
    res.status(404).json({ code: 404, message: "La ruta consultada no existe"})
})

app.listen(PORT,() => console.log("SERVER UP"))

export default app