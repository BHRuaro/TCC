import { api } from "./api"

export interface User {
    id?: number
    name: string
    username: string
    role: string
    password?: string
    active: boolean
}

export async function getAllUsers(): Promise<User[]> {
    const response = await api.get("/users")
    return response.data
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
    const response = await api.post("/auth/register", data)
    return response.data
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data)
    return response.data
}

export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
}

export async function changePassword(id: number, newPassword: string): Promise<void> {
    await api.patch(`/users/${id}/password`, { newPassword })
}
