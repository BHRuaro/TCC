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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Select,
    FormLabel,
    SimpleGrid,
    Textarea,
    IconButton,
    List,
    ListItem,
    Divider,
    Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { AddIcon, ViewIcon } from "@chakra-ui/icons"
import { getAllItems } from "../services/ItemService"
import { getAllSuppliers } from "../services/SupplierService"
import { getAllPersons } from "../services/PersonService"
import { getAllMovements, createMovement } from "../services/MovementsService"
import type { Movement } from "../services/MovementsService"
import SearchBar from "../components/SearchBar"
import RequiredLabel from "../components/RequiredLabel"

type MappedMovement = Movement & {
    usuarioNome: string
    fornecedorNome: string
    pessoaNome: string
    itensTexto: string
}

interface LoggedUser {
    id: number
    name: string
}

export default function Movements() {
    const [movements, setMovements] = useState<Movement[]>([])
    const [filteredMovements, setFilteredMovements] = useState<MappedMovement[]>([])
    const [items, setItems] = useState<any[]>([])
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [persons, setPersons] = useState<any[]>([])
    const [user, setUser] = useState<LoggedUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [movementType, setMovementType] = useState<"ENTRADA" | "SAIDA" | "">("")
    const [supplierId, setSupplierId] = useState<number | "">("")
    const [personId, setPersonId] = useState<number | "">("")
    const [observation, setObservation] = useState("")
    const [itemMovements, setItemMovements] = useState<
        { itemId: number | ""; quantity: number | "" }[]
    >([{ itemId: "", quantity: "" }])

    const [selectedMovement, setSelectedMovement] = useState<MappedMovement | null>(
        null
    )

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isDetailOpen,
        onOpen: onDetailOpen,
        onClose: onDetailClose,
    } = useDisclosure()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) setUser(JSON.parse(storedUser))
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [movementsData, itemsData, suppliersData, personsData] =
                await Promise.all([
                    getAllMovements(),
                    getAllItems(),
                    getAllSuppliers(),
                    getAllPersons(),
                ])

            const mapped: MappedMovement[] = movementsData.map((m) => {
                const fornecedor = suppliersData.find((s) => s.id === m.supplierId)
                const pessoa = personsData.find((p) => p.id === m.personId)
                const itens = m.itemMovements
                    ?.map((im) => {
                        const item = itemsData.find((i) => i.id === im.itemId)
                        return item ? `${item.name} (${im.quantity})` : ""
                    })
                    .filter(Boolean)
                    .join(", ")

                return {
                    ...m,
                    fornecedorNome: fornecedor ? fornecedor.name : "",
                    pessoaNome: pessoa ? pessoa.name : "",
                    usuarioNome: m.userId ? `${m.userId} - ${m.userName || ""}` : "-",
                    itensTexto: itens,
                }
            })

            setMovements(movementsData)
            setFilteredMovements(mapped)
            setItems(itemsData)
            setSuppliers(suppliersData)
            setPersons(personsData)
        } catch (err: any) {
            toast({
                title: "Erro ao carregar dados",
                description: err.message,
                status: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleAddItemRow = () => {
        setItemMovements([...itemMovements, { itemId: "", quantity: "" }])
    }

    const handleRemoveItemRow = (index: number) => {
        const newList = [...itemMovements]
        newList.splice(index, 1)
        setItemMovements(newList)
    }

    const handleSave = async () => {
        if (!movementType) {
            toast({ title: "Selecione o tipo de movimentação", status: "warning" })
            return
        }
        if (movementType === "ENTRADA" && !supplierId) {
            toast({ title: "Selecione o fornecedor", status: "warning" })
            return
        }
        if (movementType === "SAIDA" && !personId) {
            toast({ title: "Selecione a pessoa", status: "warning" })
            return
        }
        if (itemMovements.some((im) => !im.itemId || !im.quantity)) {
            toast({ title: "Informe os itens e quantidades", status: "warning" })
            return
        }

        const itemIds = itemMovements.map((im) => im.itemId)
        const hasDuplicates = new Set(itemIds).size !== itemIds.length
        if (hasDuplicates) {
            toast({
                title: "Itens duplicados",
                description: "Não é permitido repetir o mesmo item na movimentação.",
                status: "warning",
            })
            return
        }

        const payload = {
            type: movementType,
            dateTime: new Date().toISOString(),
            userId: user!.id,
            observation: observation.trim() === "" ? null : observation.trim(),
            supplierId: movementType === "ENTRADA" ? Number(supplierId) : null,
            personId: movementType === "SAIDA" ? Number(personId) : null,
            itemMovements: itemMovements.map((i) => ({
                itemId: Number(i.itemId),
                quantity: Number(i.quantity),
            })),
        }

        try {
            setSaving(true)
            const response = await createMovement(payload)
            const newMovement = response.movement
            const warnings = response.warnings

            const updatedList = [...movements, newMovement]
            setMovements(updatedList)

            toast({ title: "Movimentação registrada!", status: "success" })

            if (warnings && warnings.length > 0) {
                warnings.forEach((msg) => {
                    toast({
                        title: "Aviso de Estoque",
                        description: msg,
                        status: "warning",
                        duration: 6000,
                        isClosable: true,
                    })
                })
            }

            setMovementType("")
            setSupplierId("")
            setPersonId("")
            setObservation("")
            setItemMovements([{ itemId: "", quantity: "" }])

            onClose()
            loadData()
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao salvar movimentação"
            toast({
                title: "Erro ao salvar movimentação",
                description: msg,
                status: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleViewDetails = (movement: MappedMovement) => {
        setSelectedMovement(movement)
        onDetailOpen()
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="teal.600" id="heading-movements">
                    Movimentações de Estoque
                </Heading>
                <Button id="btn-new-movement" colorScheme="teal" onClick={onOpen}>
                    Nova Movimentação
                </Button>
            </Flex>

            <SearchBar
                data={movements.map((m) => ({
                    ...m,
                    fornecedorNome: suppliers.find((s) => s.id === m.supplierId)?.name || "",
                    pessoaNome: persons.find((p) => p.id === m.personId)?.name || "",
                    usuarioNome: m.userId ? `${m.userId} - ${m.userName || ""}` : "-",
                    itensTexto: m.itemMovements
                        ?.map((im) => {
                            const item = items.find((i) => i.id === im.itemId)
                            return item ? `${item.name} (${im.quantity})` : ""
                        })
                        .filter(Boolean)
                        .join(", "),
                }))}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "type", label: "Tipo" },
                    { key: "dateTime", label: "Data/Hora" },
                    { key: "usuarioNome", label: "Usuário" },
                    { key: "fornecedorNome", label: "Fornecedor" },
                    { key: "pessoaNome", label: "Pessoa" },
                    { key: "itensTexto", label: "Itens" },
                ]}
                onSearch={setFilteredMovements}
            />

            {loading ? (
                <Spinner id="spinner-movements" />
            ) : (
                <Table variant="simple" mt={4} id="table-movements">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Tipo</Th>
                            <Th>Data/Hora</Th>
                            <Th>Usuário</Th>
                            <Th>Fornecedor</Th>
                            <Th>Pessoa</Th>
                            <Th>Itens</Th>
                            <Th>Observação</Th>
                            <Th textAlign="center">Detalhes</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredMovements.map((m) => (
                            <Tr key={m.id} id={`row-movement-${m.id}`}>
                                <Td>{m.id}</Td>
                                <Td>{m.type}</Td>
                                <Td>{new Date(m.dateTime).toLocaleString()}</Td>
                                <Td>{m.usuarioNome}</Td>
                                <Td>{m.fornecedorNome || "-"}</Td>
                                <Td>{m.pessoaNome || "-"}</Td>
                                <Td>{m.itensTexto || "-"}</Td>
                                <Td>{m.observation || "-"}</Td>
                                <Td textAlign="center">
                                    <IconButton
                                        id={`btn-view-movement-${m.id}`}
                                        aria-label="Ver detalhes"
                                        icon={<ViewIcon />}
                                        colorScheme="teal"
                                        size="sm"
                                        onClick={() => handleViewDetails(m)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            <Modal isOpen={isDetailOpen} onClose={onDetailClose} isCentered size="lg">
                <ModalOverlay />
                <ModalContent id="modal-movement-details">
                    <ModalHeader id="modal-movement-details-header">
                        Detalhes da Movimentação
                    </ModalHeader>
                    <ModalCloseButton id="btn-close-details" />
                    <ModalBody id="modal-body-movements-details">
                        {selectedMovement ? (
                            <>
                                <Text>
                                    <b>ID:</b> {selectedMovement.id}
                                </Text>
                                <Text>
                                    <b>Tipo:</b> {selectedMovement.type}
                                </Text>
                                <Text>
                                    <b>Data/Hora:</b>{" "}
                                    {new Date(selectedMovement.dateTime).toLocaleString()}
                                </Text>
                                <Text>
                                    <b>Usuário:</b> {selectedMovement.usuarioNome}
                                </Text>
                                {selectedMovement.fornecedorNome && (
                                    <Text>
                                        <b>Fornecedor:</b> {selectedMovement.fornecedorNome}
                                    </Text>
                                )}
                                {selectedMovement.pessoaNome && (
                                    <Text>
                                        <b>Pessoa:</b> {selectedMovement.pessoaNome}
                                    </Text>
                                )}
                                {selectedMovement.observation && (
                                    <Text mt={2}>
                                        <b>Observação:</b> {selectedMovement.observation}
                                    </Text>
                                )}
                                <Divider my={3} />
                                <Heading size="sm" mb={2}>
                                    Itens
                                </Heading>
                                <List spacing={1}>
                                    {selectedMovement.itemMovements?.map((im) => {
                                        const item = items.find((i) => i.id === im.itemId)
                                        return (
                                            <ListItem key={im.id || im.itemId}>
                                                {item ? item.name : `Item ${im.itemId}`} —{" "}
                                                <b>Quantidade:</b> {im.quantity}
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </>
                        ) : (
                            <Text>Nenhuma movimentação selecionada.</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button id="btn-close-details-footer" onClick={onDetailClose}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
                <ModalOverlay />
                <ModalContent id="modal-new-movement">
                    <ModalHeader id="modal-new-movement-header">
                        Nova Movimentação
                    </ModalHeader>
                    <ModalCloseButton id="btn-close-new-movement" />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={4}>
                            <Box>
                                <RequiredLabel>Tipo de Movimentação</RequiredLabel>
                                <Select
                                    id="select-movement-type"
                                    placeholder="Selecione"
                                    value={movementType}
                                    onChange={(e) =>
                                        setMovementType(e.target.value as "ENTRADA" | "SAIDA")
                                    }
                                >
                                    <option value="ENTRADA">Entrada</option>
                                    <option value="SAIDA">Saída</option>
                                </Select>
                            </Box>

                            {movementType === "ENTRADA" && (
                                <Box>
                                    <RequiredLabel>Fornecedor</RequiredLabel>
                                    <Select
                                        id="select-supplier"
                                        placeholder="Selecione o fornecedor"
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(Number(e.target.value))}
                                    >
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {`${s.id} - ${s.name}`}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                            )}

                            {movementType === "SAIDA" && (
                                <Box>
                                    <RequiredLabel>Pessoa</RequiredLabel>
                                    <Select
                                        id="select-person"
                                        placeholder="Selecione a pessoa"
                                        value={personId}
                                        onChange={(e) => setPersonId(Number(e.target.value))}
                                    >
                                        {persons.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {`${p.id} - ${p.name}`}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                            )}

                            <Box>
                                <RequiredLabel>Usuário</RequiredLabel>
                                <Input
                                    id="input-movement-user"
                                    value={user ? `${user.id} - ${user.name}` : ""}
                                    isReadOnly
                                    bg="gray.100"
                                    color="gray.700"
                                    cursor="not-allowed"
                                />
                            </Box>

                            <Box gridColumn="1 / span 2">
                                <FormLabel>Observação</FormLabel>
                                <Textarea
                                    id="input-movement-observation"
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                    placeholder="Ex: entrada de novos produtos..."
                                />
                            </Box>
                        </SimpleGrid>

                        <Heading size="sm" mt={6} mb={2}>
                            Itens
                            <Text as="span" color="red.500" ml={1}>
                                *
                            </Text>
                        </Heading>

                        {itemMovements.map((im, index) => (
                            <Flex key={index} gap={3} mb={3} id={`row-item-${index}`}>
                                <Select
                                    id={`select-item-${index}`}
                                    flex="2"
                                    placeholder="Selecione o item"
                                    value={im.itemId}
                                    onChange={(e) => {
                                        const newList = [...itemMovements]
                                        newList[index].itemId = Number(e.target.value)
                                        setItemMovements(newList)
                                    }}
                                >
                                    {items.map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {`${i.id} - ${i.name}`}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    id={`input-quantity-${index}`}
                                    flex="1"
                                    type="number"
                                    min={1}
                                    placeholder="Qtd."
                                    value={im.quantity}
                                    onChange={(e) => {
                                        const value = Number(e.target.value)
                                        const newList = [...itemMovements]
                                        newList[index].quantity = value
                                        setItemMovements(newList)
                                    }}
                                />
                                {itemMovements.length > 1 && (
                                    <Button
                                        id={`btn-remove-item-${index}`}
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => handleRemoveItemRow(index)}
                                    >
                                        Remover
                                    </Button>
                                )}
                            </Flex>
                        ))}

                        <Button
                            id="btn-add-item"
                            leftIcon={<AddIcon />}
                            size="sm"
                            colorScheme="teal"
                            variant="outline"
                            onClick={handleAddItemRow}
                        >
                            Adicionar Item
                        </Button>
                    </ModalBody>

                    <ModalFooter>
                        <Button id="btn-cancel-movement" variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            id="btn-save-movement"
                            colorScheme="teal"
                            onClick={handleSave}
                            isLoading={saving}
                        >
                            Salvar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}