import SearchBar from "../components/SearchBar"
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Spinner,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
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
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    // 🔹 Recupera a role salva no localStorage
    const role = localStorage.getItem("role")
    const isAdmin = role === "ROLE_ADMIN"

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

    const handleOpenModal = (category?: Category) => {
        if (!isAdmin) {
            toast({
                title: "Acesso restrito",
                description: "Somente administradores podem criar ou editar categorias.",
                status: "warning",
            })
            return
        }

        if (category) {
            setEditingCategory(category)
            setDescription(category.description ?? "")
        } else {
            setEditingCategory(null)
            setDescription("")
        }
        onOpen()
    }

    const handleSave = async () => {
        if (!isAdmin) {
            toast({
                title: "Acesso restrito",
                description: "Somente administradores podem realizar esta ação.",
                status: "warning",
            })
            return
        }

        if (!description.trim()) {
            toast({
                title: "Informe uma descrição",
                status: "warning",
            })
            return
        }

        try {
            setSaving(true)
            if (editingCategory) {
                const updated = await updateCategory(editingCategory.id!, { description })
                const updatedList = categories.map((c) =>
                    c.id === updated.id ? updated : c
                )
                setCategories(updatedList)
                setFilteredCategories(updatedList)
                toast({ title: "Categoria atualizada com sucesso!", status: "success" })
            } else {
                const newCategory = await createCategory({ description })
                const updatedList = [...categories, newCategory]
                setCategories(updatedList)
                setFilteredCategories(updatedList)
                toast({ title: "Categoria criada com sucesso!", status: "success" })
            }
            onClose()
        } catch (err: any) {
            toast({
                title: "Erro ao salvar categoria",
                description: err.message,
                status: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!isAdmin) {
            toast({
                title: "Acesso restrito",
                description: "Somente administradores podem excluir categorias.",
                status: "warning",
            })
            return
        }

        try {
            await deleteCategory(id)
            const updatedList = categories.filter((c) => c.id !== id)
            setCategories(updatedList)
            setFilteredCategories(updatedList)
            toast({ title: "Categoria excluída", status: "info" })
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Erro ao excluir categoria"
            toast({
                title: "Erro ao excluir categoria",
                description: errorMessage,
                status: "error",
            })
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="teal.600">
                    Categorias
                </Heading>

                {isAdmin && (
                    <Button colorScheme="teal" onClick={() => handleOpenModal()}>
                        Adicionar
                    </Button>
                )}
            </Flex>

            <SearchBar
                data={categories}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "description", label: "Descrição" },
                ]}
                onSearch={setFilteredCategories}
            />

            {loading ? (
                <Spinner />
            ) : (
                <Table variant="simple" mt={4}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Descrição</Th>
                            {isAdmin && <Th textAlign="center">Ações</Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredCategories.map((category) => (
                            <Tr key={category.id}>
                                <Td>{category.id}</Td>
                                <Td>{category.description}</Td>
                                {isAdmin && (
                                    <Td textAlign="center">
                                        <Flex justify="center" gap={2}>
                                            <IconButton
                                                aria-label="Editar"
                                                colorScheme="blue"
                                                size="sm"
                                                icon={<EditIcon />}
                                                onClick={() => handleOpenModal(category)}
                                            />
                                            <IconButton
                                                aria-label="Excluir"
                                                colorScheme="red"
                                                size="sm"
                                                icon={<DeleteIcon />}
                                                onClick={() => handleDelete(category.id!)}
                                            />
                                        </Flex>
                                    </Td>
                                )}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            {/* Modal de inclusão/edição */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="Descrição da categoria"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            isDisabled={!isAdmin}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        {isAdmin && (
                            <Button
                                colorScheme="teal"
                                onClick={handleSave}
                                isLoading={saving}
                            >
                                Salvar
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
