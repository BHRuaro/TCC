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
    Switch,
    Select,
    SimpleGrid,
    Tooltip,
} from "@chakra-ui/react"
import { useEffect, useState, useMemo } from "react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { FaKey } from "react-icons/fa"
import SearchBar from "../components/SearchBar"
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    type User,
} from "../services/UserService"

// Função para decodificar o campo "sub" (username) do JWT
function decodeJwtSub(token?: string | null): string | null {
    try {
        if (!token) return null
        const [, payload] = token.split(".")
        if (!payload) return null
        const json = JSON.parse(atob(payload))
        return json?.sub ?? null
    } catch {
        return null
    }
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("USER")
    const [password, setPassword] = useState("")
    const [active, setActive] = useState(true)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const toast = useToast()

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure()

    // 🔹 pega info do logado
    const token = localStorage.getItem("token")
    const loggedUsername = useMemo(() => decodeJwtSub(token), [token])
    const roleStorage = localStorage.getItem("role")
    const isAdmin = roleStorage === "ROLE_ADMIN"

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsers()
            setUsers(data)
            setFilteredUsers(data)
        } catch (err: any) {
            toast({
                title: "Erro ao carregar usuários",
                description: err.message,
                status: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleOpenEdit = (user?: User) => {
        if (user) {
            setEditingUser(user)
            setName(user.name)
            setUsername(user.username)
            setRole(user.role || "USER")
            setActive(user.active)
        } else {
            setEditingUser(null)
            setName("")
            setUsername("")
            setPassword("")
            setRole("USER")
            setActive(true)
        }
        onEditOpen()
    }

    const handleSave = async () => {
        if (!name.trim() || !username.trim()) {
            toast({
                title: "Preencha os campos obrigatórios (Nome e Usuário)",
                status: "warning",
            })
            return
        }

        try {
            setSaving(true)
            if (editingUser) {
                const updated = await updateUser(editingUser.id!, {
                    name,
                    username,
                    role,
                    active,
                })
                const updatedList = users.map((u) =>
                    u.id === updated.id ? updated : u
                )
                setUsers(updatedList)
                setFilteredUsers(updatedList)
                toast({ title: "Usuário atualizado com sucesso!", status: "success" })
            } else {
                if (!password.trim()) {
                    toast({
                        title: "A senha é obrigatória ao criar um novo usuário",
                        status: "warning",
                    })
                    return
                }
                const newUser = await createUser({
                    name,
                    username,
                    role,
                    password,
                    active,
                })
                const updatedList = [...users, newUser]
                setUsers(updatedList)
                setFilteredUsers(updatedList)
                toast({ title: "Usuário criado com sucesso!", status: "success" })
            }
            onEditClose()
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao salvar usuário"
            toast({ title: "Erro ao salvar usuário", description: msg, status: "error" })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id)
            const updatedList = users.filter((u) => u.id !== id)
            setUsers(updatedList)
            setFilteredUsers(updatedList)
            toast({ title: "Usuário excluído", status: "info" })
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao excluir usuário"
            toast({ title: "Erro ao excluir usuário", description: msg, status: "error" })
        }
    }

    const handleOpenPasswordModal = (id: number, username: string) => {
        if (!isAdmin && username !== loggedUsername) {
            toast({
                title: "Acesso negado",
                description: "Você só pode alterar a sua própria senha.",
                status: "warning",
            })
            return
        }
        setSelectedUserId(id)
        setNewPassword("")
        onPasswordOpen()
    }

    const handleChangePassword = async () => {
        if (!newPassword.trim()) {
            toast({
                title: "A nova senha não pode ser vazia",
                status: "warning",
            })
            return
        }

        try {
            setSaving(true)
            await changePassword(selectedUserId!, newPassword)
            toast({ title: "Senha alterada com sucesso!", status: "success" })
            onPasswordClose()
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao alterar senha"
            toast({ title: "Erro ao alterar senha", description: msg, status: "error" })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="teal.600">
                    Usuários
                </Heading>
                <Tooltip label="Somente administradores podem criar usuários" isDisabled={isAdmin}>
                    <Button colorScheme="teal" onClick={() => handleOpenEdit()} isDisabled={!isAdmin}>
                        Adicionar
                    </Button>
                </Tooltip>
            </Flex>

            <SearchBar
                data={users}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "username", label: "Usuário" },
                    { key: "name", label: "Nome" },
                    { key: "role", label: "Função" },
                ]}
                onSearch={setFilteredUsers}
            />

            {loading ? (
                <Spinner />
            ) : (
                <Table variant="simple" mt={4}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nome</Th>
                            <Th>Usuário</Th>
                            <Th>Função</Th>
                            <Th>Ativo</Th>
                            <Th textAlign="center">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredUsers.map((u) => {
                            const canChangeOwnPassword = u.username === loggedUsername || isAdmin

                            return (
                                <Tr key={u.id}>
                                    <Td>{u.id}</Td>
                                    <Td>{u.name}</Td>
                                    <Td>{u.username}</Td>
                                    <Td>{u.role === "ROLE_ADMIN" ? "Admin" : "Usuário"}</Td>
                                    <Td>{u.active ? "Sim" : "Não"}</Td>
                                    <Td textAlign="center">
                                        <Flex justify="center" gap={2}>
                                            <Tooltip label="Somente administradores podem editar" isDisabled={isAdmin}>
                                                <IconButton
                                                    aria-label="Editar"
                                                    colorScheme="blue"
                                                    size="sm"
                                                    icon={<EditIcon />}
                                                    onClick={() => handleOpenEdit(u)}
                                                    isDisabled={!isAdmin}
                                                />
                                            </Tooltip>

                                            <Tooltip
                                                label={
                                                    canChangeOwnPassword
                                                        ? "Alterar senha"
                                                        : "Você só pode alterar a sua própria senha"
                                                }
                                                isDisabled={canChangeOwnPassword}
                                            >
                                                <IconButton
                                                    aria-label="Trocar senha"
                                                    colorScheme="yellow"
                                                    size="sm"
                                                    icon={<FaKey />}
                                                    onClick={() => handleOpenPasswordModal(u.id!, u.username)}
                                                    isDisabled={!canChangeOwnPassword}
                                                />
                                            </Tooltip>

                                            <Tooltip label="Somente administradores podem excluir" isDisabled={isAdmin}>
                                                <IconButton
                                                    aria-label="Excluir"
                                                    colorScheme="red"
                                                    size="sm"
                                                    icon={<DeleteIcon />}
                                                    onClick={() => handleDelete(u.id!)}
                                                    isDisabled={!isAdmin}
                                                />
                                            </Tooltip>
                                        </Flex>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            )}

            {/* MODAL TROCA DE SENHA */}
            <Modal isOpen={isPasswordOpen} onClose={onPasswordClose} isCentered size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Alterar Senha</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>Nova Senha</FormLabel>
                        <Input
                            type="password"
                            placeholder="Digite a nova senha"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onPasswordClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="teal" onClick={handleChangePassword} isLoading={saving}>
                            Alterar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
