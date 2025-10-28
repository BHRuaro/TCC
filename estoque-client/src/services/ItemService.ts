import { api } from "./api"

export interface Item {
    id?: number
    name: string
    description: string
    unitPrice: number
    stockQuantity: number
    minStockQuantity: number
    expirationDate: string
    movementLimit: number
    categoryId: number
    supplierId: number
    userId?: number
    userName?: string
}

export async function getAllItems(): Promise<Item[]> {
    const response = await api.get("/items")
    return response.data
}

export async function createItem(data: Omit<Item, "id">): Promise<Item> {
    const response = await api.post("/items", data)
    return response.data
}

export async function updateItem(id: number, data: Partial<Item>): Promise<Item> {
    const response = await api.put(`/items/${id}`, data)
    return response.data
}

export async function deleteItem(id: number): Promise<void> {
    await api.delete(`/items/${id}`)
}