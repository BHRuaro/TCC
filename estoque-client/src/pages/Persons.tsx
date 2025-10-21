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
import SearchBar from "../components/SearchBar"
import {
    getAllPersons,
    createPerson,
    updatePerson,
    deletePerson,
    type Person,
} from "../services/PersonService"

interface LoggedUser {
    id: number
    name: string
    username: string
}

export default function Persons() {
    const [persons, setPersons] = useState<Person[]>([])
    const [filteredPersons, setFilteredPersons] = useState<Person[]>([])
    const [cpf, setCpf] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [user, setUser] = useState<LoggedUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingPerson, setEditingPerson] = useState<Person | null>(null)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    // ✅ Máscara de CPF
    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 11)
        if (cleaned.length <= 3) return cleaned
        if (cleaned.length <= 6) return cleaned.replace(/^(\d{3})(\d+)/, "$1.$2")
        if (cleaned.length <= 9)
            return cleaned.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3")
        return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, "$1.$2.$3-$4")
    }

    // ✅ Validação de CPF (mínima)
    const isValidCPF = (value: string) => {
        const digits = value.replace(/\D/g, "")
        return /^\d{11}$/.test(digits)
    }

    // ✅ Validação de e-mail simples
    const isValidEmail = (value: string) => {
        if (!value) return true // opcional
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(value)
    }

    // Usuário logado
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) setUser(JSON.parse(storedUser))
        else setUser({ id: 1, name: "Bruno Ruaro", username: "bruaro" })
    }, [])

    const loadPersons = async () => {
        try {
            setLoading(true)
            const data = await getAllPersons()
            setPersons(data)
            setFilteredPersons(data)
        } catch (err: any) {
            toast({
                title: "Erro ao carregar pessoas",
                description: err.message,
                status: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPersons()
    }, [])

    const handleOpenModal = (person?: Person) => {
        if (person) {
            setEditingPerson(person)
            setCpf(person.cpf)
            setName(person.name)
            setEmail(person.email || "")
        } else {
            setEditingPerson(null)
            setCpf("")
            setName("")
            setEmail("")
        }
        onOpen()
    }

    const handleSave = async () => {
        if (!cpf.trim() || !name.trim()) {
            toast({
                title: "Preencha os campos obrigatórios (CPF e Nome)",
                status: "warning",
            })
            return
        }

        if (!isValidCPF(cpf)) {
            toast({
                title: "CPF inválido",
                description: "Informe um CPF com 11 dígitos numéricos válidos.",
                status: "error",
            })
            return
        }

        if (!isValidEmail(email)) {
            toast({
                title: "E-mail inválido",
                description: "Informe um e-mail no formato nome@dominio.com",
                status: "error",
            })
            return
        }

        const payload = {
            cpf,
            name,
            email,
            userId: user?.id,
        }

        try {
            setSaving(true)
            if (editingPerson) {
                const updated = await updatePerson(editingPerson.id!, payload)
                const updatedList = persons.map((p) =>
                    p.id === updated.id ? updated : p
                )
                setPersons(updatedList)
                setFilteredPersons(updatedList)
                toast({ title: "Pessoa atualizada com sucesso!", status: "success" })
            } else {
                const newPerson = await createPerson(payload)
                const updatedList = [...persons, newPerson]
                setPersons(updatedList)
                setFilteredPersons(updatedList)
                toast({ title: "Pessoa criada com sucesso!", status: "success" })
            }
            onClose()
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao salvar pessoa"
            toast({ title: "Erro ao salvar pessoa", description: msg, status: "error" })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deletePerson(id)
            const updatedList = persons.filter((p) => p.id !== id)
            setPersons(updatedList)
            setFilteredPersons(updatedList)
            toast({ title: "Pessoa excluída", status: "info" })
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao excluir pessoa"
            toast({ title: "Erro ao excluir pessoa", description: msg, status: "error" })
        }
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="teal.600">
                    Pessoas
                </Heading>
                <Button colorScheme="teal" onClick={() => handleOpenModal()}>
                    Adicionar
                </Button>
            </Flex>

            <SearchBar
                data={persons}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "cpf", label: "CPF" },
                    { key: "name", label: "Nome" },
                    { key: "email", label: "Email" },
                ]}
                onSearch={setFilteredPersons}
            />

            {loading ? (
                <Spinner />
            ) : (
                <Table variant="simple" mt={4}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>CPF</Th>
                            <Th>Nome</Th>
                            <Th>Email</Th>
                            <Th>Usuário</Th>
                            <Th textAlign="center">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredPersons.map((p) => (
                            <Tr key={p.id}>
                                <Td>{p.id}</Td>
                                <Td>{p.cpf}</Td>
                                <Td>{p.name}</Td>
                                <Td>{p.email || "-"}</Td>
                                <Td>{user ? `${user.id} - ${user.name}` : "-"}</Td>
                                <Td textAlign="center">
                                    <Flex justify="center" gap={2}>
                                        <IconButton
                                            aria-label="Editar"
                                            colorScheme="blue"
                                            size="sm"
                                            icon={<EditIcon />}
                                            onClick={() => handleOpenModal(p)}
                                        />
                                        <IconButton
                                            aria-label="Excluir"
                                            colorScheme="red"
                                            size="sm"
                                            icon={<DeleteIcon />}
                                            onClick={() => handleDelete(p.id!)}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            {/* MODAL */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {editingPerson ? "Editar Pessoa" : "Nova Pessoa"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>CPF</FormLabel>
                        <Input
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={(e) => setCpf(formatCPF(e.target.value))}
                            maxLength={14}
                            mb={3}
                        />

                        <FormLabel>Nome</FormLabel>
                        <Input
                            placeholder="Nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            mb={3}
                        />

                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={120}
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
