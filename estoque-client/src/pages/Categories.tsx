import SearchBar from "../components/SearchBar"
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Spinner,
    IconButton,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons"
import {
    getAllCategories,
    createCategory,
    deleteCategory,
    updateCategory,
} from "../services/CategoryService"
import type { Category } from "../services/CategoryService"

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editDescription, setEditDescription] = useState("")
    const toast = useToast()

    const loadCategories = async () => {
        try {
            setLoading(true)
            const data = await getAllCategories()
            setCategories(data)
            setFilteredCategories(data)
        } catch (err: any) {
            toast({
                title: "Erro ao carregar categorias",
                description: err.message,
                status: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!description.trim()) {
            toast({
                title: "Informe uma descrição",
                status: "warning",
            })
            return
        }

        try {
            setSaving(true)
            const newCategory = await createCategory({ description })
            const updated = [...categories, newCategory]
            setCategories(updated)
            setFilteredCategories(updated)
            toast({ title: "Categoria criada com sucesso!", status: "success" })
        } catch (err: any) {
            toast({
                title: "Erro ao criar categoria",
                description: err.message,
                status: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id)
            const updatedList = categories.filter((c) => c.id !== id)
            setCategories(updatedList)
            setFilteredCategories(updatedList)
            toast({ title: "Categoria excluída", status: "info" })
        } catch (err: any) {
            toast({
                title: "Erro ao excluir categoria",
                description: err.message,
                status: "error",
            })
        }
    }

    const handleEdit = (category: Category) => {
        setEditingId(category.id!)
        setEditDescription(category.description ?? "")
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditDescription("")
    }

    const handleUpdate = async (id: number) => {
        if (!editDescription.trim()) {
            toast({
                title: "Informe uma descrição",
                status: "warning",
            })
            return
        }

        try {
            setSaving(true)
            const updated = await updateCategory(id, { description: editDescription })
            const updatedList = categories.map((c) => (c.id === id ? updated : c))
            setCategories(updatedList)
            setFilteredCategories(updatedList)
            toast({ title: "Categoria atualizada com sucesso!", status: "success" })
            setEditingId(null)
            setEditDescription("")
        } catch (err: any) {
            toast({
                title: "Erro ao atualizar categoria",
                description: err.message,
                status: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <Box>
            <Heading size="lg" mb={6} color="teal.600">
                Categorias
            </Heading>

            <SearchBar
                data={categories}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "description", label: "Descrição" },
                ]}
                onSearch={setFilteredCategories}
            />

            <Flex gap={4} mb={6}>
                <Input
                    placeholder="Descrição da categoria"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    w="50%"
                />
                <Button colorScheme="teal" onClick={handleAdd} isLoading={saving}>
                    Adicionar
                </Button>
            </Flex>

            {loading ? (
                <Spinner />
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Descrição</Th>
                            <Th textAlign="center">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredCategories.map((category) => (
                            <Tr key={category.id}>
                                <Td>{category.id}</Td>

                                <Td>
                                    {editingId === category.id ? (
                                        <Input
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            size="sm"
                                        />
                                    ) : (
                                        category.description
                                    )}
                                </Td>

                                <Td textAlign="center">
                                    {editingId === category.id ? (
                                        <Flex justify="center" gap={2}>
                                            <IconButton
                                                aria-label="Salvar"
                                                colorScheme="green"
                                                size="sm"
                                                icon={<CheckIcon />}
                                                isLoading={saving}
                                                onClick={() => handleUpdate(category.id!)}
                                            />
                                            <IconButton
                                                aria-label="Cancelar"
                                                colorScheme="gray"
                                                size="sm"
                                                icon={<CloseIcon />}
                                                onClick={handleCancelEdit}
                                            />
                                        </Flex>
                                    ) : (
                                        <Flex justify="center" gap={2}>
                                            <IconButton
                                                aria-label="Editar"
                                                colorScheme="blue"
                                                size="sm"
                                                icon={<EditIcon />}
                                                onClick={() => handleEdit(category)}
                                            />
                                            <IconButton
                                                aria-label="Excluir"
                                                colorScheme="red"
                                                size="sm"
                                                icon={<DeleteIcon />}
                                                onClick={() => handleDelete(category.id!)}
                                            />
                                        </Flex>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    )
}