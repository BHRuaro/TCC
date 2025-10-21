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
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
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

    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure()
    const {
        isOpen: isPasswordOpen,
        onOpen: onPasswordOpen,
        onClose: onPasswordClose,
    } = useDisclosure()

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

    const handleOpenPasswordModal = (id: number) => {
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
                <Button colorScheme="teal" onClick={() => handleOpenEdit()}>
                    Adicionar
                </Button>
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
                        {filteredUsers.map((u) => (
                            <Tr key={u.id}>
                                <Td>{u.id}</Td>
                                <Td>{u.name}</Td>
                                <Td>{u.username}</Td>
                                <Td>{u.role === "ROLE_ADMIN" ? "Admin" : "Usuário"}</Td>
                                <Td>{u.active ? "Sim" : "Não"}</Td>
                                <Td textAlign="center">
                                    <Flex justify="center" gap={2}>
                                        <IconButton
                                            aria-label="Editar"
                                            colorScheme="blue"
                                            size="sm"
                                            icon={<EditIcon />}
                                            onClick={() => handleOpenEdit(u)}
                                        />
                                        <IconButton
                                            aria-label="Trocar senha"
                                            colorScheme="yellow"
                                            size="sm"
                                            icon={<FaKey />}
                                            onClick={() => handleOpenPasswordModal(u.id!)}
                                        />
                                        <IconButton
                                            aria-label="Excluir"
                                            colorScheme="red"
                                            size="sm"
                                            icon={<DeleteIcon />}
                                            onClick={() => handleDelete(u.id!)}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
            <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {editingUser ? "Editar Usuário" : "Novo Usuário"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={4}>
                            <Box>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={100}
                                    mb={3}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Usuário</FormLabel>
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    maxLength={60}
                                    mb={3}
                                />
                            </Box>
                            {!editingUser && (
                                <Box>
                                    <FormLabel>Senha</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        mb={3}
                                    />
                                </Box>
                            )}
                            <Box>
                                <FormLabel>Função</FormLabel>
                                <Select value={role} onChange={(e) => setRole(e.target.value)} mb={3}>
                                    <option value="ROLE_ADMIN">Admin</option>
                                    <option value="ROLE_USER">Usuário</option>
                                </Select>
                            </Box>
                            <Box>
                                <FormLabel>Ativo</FormLabel>
                                <Switch
                                    isChecked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    colorScheme="teal"
                                    size="lg"
                                    mt={1}
                                />
                            </Box>
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onEditClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme="teal" onClick={handleSave} isLoading={saving}>
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* MODAL DE TROCA DE SENHA */}
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
                        <Button
                            colorScheme="teal"
                            onClick={handleChangePassword}
                            isLoading={saving}
                        >
                            Alterar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}