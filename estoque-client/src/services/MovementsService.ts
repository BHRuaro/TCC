import { api } from "./api"

export interface MovementResponse {
    movement: Movement
    warnings: string[]
}

export interface MovementItem {
    id?: number
    itemId: number
    quantity: number
}

export interface Movement {
    id: number
    type: "ENTRADA" | "SAIDA"
    supplierId?: number | null
    personId?: number | null
    observation?: string | null
    dateTime: string
    userId: number
    userName: string
    itemMovements: MovementItem[]
}

export interface MovementPayload {
    type: "ENTRADA" | "SAIDA"
    supplierId?: number | null
    personId?: number | null
    observation?: string | null
    dateTime: string
    userId: number
    itemMovements: MovementItem[]
}

export const createMovement = async (data: MovementPayload): Promise<MovementResponse> => {
    const payload = {
        ...data,
        supplierId: data.supplierId ?? null,
        personId: data.personId ?? null,
    }

    const response = await api.post("/movements/create", payload)
    return response.data
}

export const getAllMovements = async (): Promise<Movement[]> => {
    const response = await api.get("/movements")
    return response.data
}

export const getMovementById = async (id: number): Promise<Movement> => {
    const response = await api.get(`/movements/${id}`)
    return response.data
}
