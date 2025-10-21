import { api } from "./api"

export interface Supplier {
    id?: number
    name: string
    cnpj: string
    userId?: number
}

export async function getAllSuppliers(): Promise<Supplier[]> {
    const response = await api.get("/suppliers")
    return response.data
}

export async function createSupplier(data: Omit<Supplier, "id">): Promise<Supplier> {
    const response = await api.post("/suppliers", data)
    return response.data
}

export async function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
    const response = await api.put(`/suppliers/${id}`, data)
    return response.data
}

export async function deleteSupplier(id: number): Promise<void> {
    await api.delete(`/suppliers/${id}`)
}