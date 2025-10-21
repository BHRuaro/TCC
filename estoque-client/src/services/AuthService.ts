import axios from "axios"

const API_URL = "http://localhost:8080/auth"

export async function login(username: string, password: string) {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password })
        return response.data
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Erro ao autenticar. Verifique suas credenciais."

        throw new Error(message)
    }
}
