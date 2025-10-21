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
    FormLabel,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import {
    getAllSuppliers,
    createSupplier,
    deleteSupplier,
    updateSupplier,
} from "../services/SupplierService"
import type { Supplier } from "../services/SupplierService"

interface LoggedUser {
    id: number
    name: string
    username: string
}

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
    const [name, setName] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [user, setUser] = useState<LoggedUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            setUser({ id: 1, name: "Bruno Ruaro", username: "bruaro" })
        }
    }, [])

    const loadSuppliers = async () => {
        try {
            setLoading(true)
            const data = await getAllSuppliers()
            setSuppliers(data)
            setFilteredSuppliers(data)
        } catch (err: any) {
            toast({
                title: "Erro ao carregar fornecedores",
                description: err.message,
                status: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (supplier?: Supplier) => {
        if (supplier) {
            setEditingSupplier(supplier)
            setName(supplier.name)
            setCnpj(supplier.cnpj)
        } else {
            setEditingSupplier(null)
            setName("")
            setCnpj("")
        }
        onOpen()
    }

    const formatCNPJ = (value: string) => {
        const cleaned = value.replace(/\D/g, "")
        let formatted = cleaned

        if (cleaned.length <= 2) formatted = cleaned
        else if (cleaned.length <= 5)
            formatted = cleaned.replace(/^(\d{2})(\d+)/, "$1.$2")
        else if (cleaned.length <= 8)
            formatted = cleaned.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3")
        else if (cleaned.length <= 12)
            formatted = cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4")
        else
            formatted = cleaned.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/,
                "$1.$2.$3/$4-$5"
            )

        return formatted
    }

    const isValidCNPJ = (value: string) => {
        const cleaned = value.replace(/[^\d]+/g, "")
        return /^\d{14}$/.test(cleaned)
    }

    const handleSave = async () => {
        if (!name.trim() || !cnpj.trim()) {
            toast({
                title: "Preencha todos os campos",
                status: "warning",
            })
            return
        }

        if (!isValidCNPJ(cnpj)) {
            toast({
                title: "CNPJ inválido",
                description: "Informe um CNPJ válido (14 dígitos numéricos).",
                status: "error",
            })
            return
        }

        try {
            setSaving(true)
            if (editingSupplier) {
                const updated = await updateSupplier(editingSupplier.id!, {
                    name,
                    cnpj,
                    userId: user?.id,
                })
                const updatedList = suppliers.map((s) =>
                    s.id === updated.id ? updated : s
                )
                setSuppliers(updatedList)
                setFilteredSuppliers(updatedList)
                toast({ title: "Fornecedor atualizado com sucesso!", status: "success" })
            } else {
                const newSupplier = await createSupplier({
                    name,
                    cnpj,
                    userId: user?.id,
                })
                const updatedList = [...suppliers, newSupplier]
                setSuppliers(updatedList)
                setFilteredSuppliers(updatedList)
                toast({ title: "Fornecedor criado com sucesso!", status: "success" })
            }
            onClose()
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Erro ao salvar fornecedor"
            toast({
                title: "Erro ao salvar fornecedor",
                description: errorMessage,
                status: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteSupplier(id)
            const updatedList = suppliers.filter((s) => s.id !== id)
            setSuppliers(updatedList)
            setFilteredSuppliers(updatedList)
            toast({ title: "Fornecedor excluído", status: "info" })
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao excluir fornecedor"
            toast({
                title: "Erro ao excluir fornecedor",
                description: msg,
                status: "error",
            })
        }
    }

    useEffect(() => {
        loadSuppliers()
    }, [])

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="teal.600">
                    Fornecedores
                </Heading>
                <Button colorScheme="teal" onClick={() => handleOpenModal()}>
                    Adicionar
                </Button>
            </Flex>

            <SearchBar
                data={suppliers}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Nome" },
                    { key: "cnpj", label: "CNPJ" },
                ]}
                onSearch={setFilteredSuppliers}
            />

            {loading ? (
                <Spinner />
            ) : (
                <Table variant="simple" mt={4}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nome</Th>
                            <Th>CNPJ</Th>
                            <Th>Usuário</Th>
                            <Th textAlign="center">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredSuppliers.map((supplier) => (
                            <Tr key={supplier.id}>
                                <Td>{supplier.id}</Td>
                                <Td>{supplier.name}</Td>
                                <Td>{supplier.cnpj}</Td>
                                <Td>
                                    {supplier.userId && user && supplier.userId === user.id
                                        ? `${supplier.userId} - ${user.name}`
                                        : supplier.userId
                                            ? `${supplier.userId} - (Outro Usuário)`
                                            : "-"}
                                </Td>
                                <Td textAlign="center">
                                    <Flex justify="center" gap={2}>
                                        <IconButton
                                            aria-label="Editar"
                                            colorScheme="blue"
                                            size="sm"
                                            icon={<EditIcon />}
                                            onClick={() => handleOpenModal(supplier)}
                                        />
                                        <IconButton
                                            aria-label="Excluir"
                                            colorScheme="red"
                                            size="sm"
                                            icon={<DeleteIcon />}
                                            onClick={() => handleDelete(supplier.id!)}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            {/* MODAL */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            placeholder="Nome do fornecedor"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            mb={3}
                        />
                        <FormLabel>CNPJ</FormLabel>
                        <Input
                            placeholder="00.000.000/0000-00"
                            value={cnpj}
                            onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                            maxLength={18}
                            mb={3}
                        />
                        <FormLabel>Usuário</FormLabel>
                        <Input
                            value={user ? `${user.id} - ${user.name}` : ""}
                            isReadOnly
                            bg="gray.100"
                            color="gray.700"
                            cursor="not-allowed"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="teal" onClick={handleSave} isLoading={saving}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
