import { api } from "./api"

export interface Person {
    id?: number
    cpf: string
    name: string
    email?: string
    userId?: number
    userName?: string
}

export async function getAllPersons(): Promise<Person[]> {
    const response = await api.get("/persons")
    return response.data
}

export async function createPerson(data: Omit<Person, "id">): Promise<Person> {
    const response = await api.post("/persons", data)
    return response.data
}

export async function updatePerson(id: number, data: Partial<Person>): Promise<Person> {
    const response = await api.put(`/persons/${id}`, data)
    return response.data
}

export async function deletePerson(id: number): Promise<void> {
    await api.delete(`/persons/${id}`)
}