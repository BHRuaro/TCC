import { api } from "./api"

const BASE_URL = "/categories"

export interface Category {
    id?: number
    description?: string
}

export async function getAllCategories() {
    const response = await api.get(BASE_URL)
    return response.data
}

export async function createCategory(category: Category) {
    const response = await api.post(BASE_URL, category)
    return response.data
}

export async function updateCategory(id: number, category: Category) {
    const response = await api.put(`${BASE_URL}/${id}`, category)
    return response.data
}

export async function deleteCategory(id: number) {
    await api.delete(`${BASE_URL}/${id}`)
}