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
    Select,
    SimpleGrid,
    Tooltip,
    Icon,
    HStack
} from "@chakra-ui/react"
import { QuestionIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import SearchBar from "../components/SearchBar"
import {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
    type Item,
} from "../services/ItemService"
import { getAllCategories, type Category } from "../services/CategoryService"
import { getAllSuppliers, type Supplier } from "../services/SupplierService"
import RequiredLabel from "../components/RequiredLabel"

interface LoggedUser {
    id: number
    name: string
}

export default function Items() {
    const [items, setItems] = useState<Item[]>([])
    const [filteredItems, setFilteredItems] = useState<Item[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [user, setUser] = useState<LoggedUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingItem, setEditingItem] = useState<Item | null>(null)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [unitPrice, setUnitPrice] = useState<number | "">("")
    const [stockQuantity, setStockQuantity] = useState<number | "">("")
    const [minStockQuantity, setMinStockQuantity] = useState<number | "">("")
    const [movementLimit, setMovementLimit] = useState<number | "">("")
    const [expirationDate, setExpirationDate] = useState("")
    const [categoryId, setCategoryId] = useState<number | "">("")
    const [supplierId, setSupplierId] = useState<number | "">("")

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) setUser(JSON.parse(storedUser))
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [itemsData, categoriesData, suppliersData] = await Promise.all([
                getAllItems(),
                getAllCategories(),
                getAllSuppliers(),
            ])

            const sortedItems = [...itemsData].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
            const sortedCategories = [...categoriesData].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
            const sortedSuppliers = [...suppliersData].sort((a, b) => (a.id ?? 0) - (b.id ?? 0))


            setItems(sortedItems)
            setFilteredItems(sortedItems)
            setCategories(sortedCategories)
            setSuppliers(sortedSuppliers)
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

    const handleOpenModal = (item?: Item) => {
        if (item) {
            setEditingItem(item)
            setName(item.name)
            setDescription(item.description)
            setUnitPrice(item.unitPrice)
            setStockQuantity(item.stockQuantity)
            setMinStockQuantity(item.minStockQuantity)
            setMovementLimit(item.movementLimit)
            setExpirationDate(item.expirationDate)
            setCategoryId(item.categoryId)
            setSupplierId(item.supplierId)
        } else {
            setEditingItem(null)
            setName("")
            setDescription("")
            setUnitPrice("")
            setStockQuantity("")
            setMinStockQuantity("")
            setMovementLimit("")
            setExpirationDate("")
            setCategoryId("")
            setSupplierId("")
        }
        onOpen()
    }

    const handleSave = async () => {
        if (!name.trim()) {
            toast({ title: "Informe o nome do item", status: "warning" })
            return
        }
        if (!categoryId || !supplierId) {
            toast({
                title: "Selecione uma categoria e um fornecedor",
                status: "warning",
            })
            return
        }

        const payload = {
            name,
            description,
            unitPrice: Number(unitPrice),
            stockQuantity: Number(stockQuantity),
            minStockQuantity: Number(minStockQuantity),
            movementLimit: Number(movementLimit),
            expirationDate,
            categoryId: Number(categoryId),
            supplierId: Number(supplierId),
            userId: user?.id,
        }

        try {
            setSaving(true)
            if (editingItem) {
                const updated = await updateItem(editingItem.id!, payload)
                const updatedList = items.map((i) =>
                    i.id === updated.id ? updated : i
                )
                setItems(updatedList)
                setFilteredItems(updatedList)
                toast({ title: "Item atualizado com sucesso!", status: "success" })
            } else {
                const newItem = await createItem(payload)
                const updatedList = [...items, newItem]
                setItems(updatedList)
                setFilteredItems(updatedList)
                toast({ title: "Item criado com sucesso!", status: "success" })
            }
            onClose()
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao salvar item"
            toast({ title: "Erro ao salvar item", description: msg, status: "error" })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteItem(id)
            const updatedList = items.filter((i) => i.id !== id)
            setItems(updatedList)
            setFilteredItems(updatedList)
            toast({ title: "Item excluído", status: "info" })
        } catch (err: any) {
            const msg = err.response?.data?.message || "Erro ao excluir item"
            toast({ title: "Erro ao excluir item", description: msg, status: "error" })
        }
    }

    const mappedItems = items.map((item) => {
        const category = categories.find((c) => c.id === item.categoryId)
        const supplier = suppliers.find((s) => s.id === item.supplierId)
        return {
            ...item,
            categoryDescription: category ? category.description : "",
            supplierName: supplier ? supplier.name : "",
        }
    })

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="teal.600" id="heading-items">
                    Itens
                </Heading>
                <Button id="btn-add-item" colorScheme="teal" onClick={() => handleOpenModal()}>
                    Adicionar
                </Button>
            </Flex>

            <SearchBar
                data={mappedItems}
                fields={[
                    { key: "id", label: "ID" },
                    { key: "name", label: "Nome" },
                    { key: "description", label: "Descrição" },
                    { key: "categoryDescription", label: "Categoria" },
                    { key: "supplierName", label: "Fornecedor" },
                ]}
                onSearch={setFilteredItems}
                onReload={loadData}
            />

            {loading ? (
                <Spinner id="spinner-items" />
            ) : (
                <Table variant="simple" mt={4} id="table-items">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nome</Th>
                            <Th>Preço</Th>
                            <Th>Estoque</Th>
                            <Th>Categoria</Th>
                            <Th>Fornecedor</Th>
                            <Th>Usuário</Th>
                            <Th textAlign="center">Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredItems.map((item) => {
                            const category = categories.find((c) => c.id === item.categoryId)
                            const supplier = suppliers.find((s) => s.id === item.supplierId)
                            return (
                                <Tr key={item.id} id={`row-item-${item.id}`}>
                                    <Td>{item.id}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>R$ {item.unitPrice?.toFixed(2)}</Td>
                                    <Td>{item.stockQuantity}</Td>
                                    <Td>
                                        {category
                                            ? `${category.id} - ${category.description}`
                                            : "-"}
                                    </Td>
                                    <Td>
                                        {supplier ? `${supplier.id} - ${supplier.name}` : "-"}
                                    </Td>
                                    <Td>
                                        {item.userId
                                            ? `${item.userId} - ${item.userName}`
                                            : "-"}
                                    </Td>
                                    <Td textAlign="center">
                                        <Flex justify="center" gap={2}>
                                            <IconButton
                                                id={`btn-edit-item-${item.id}`}
                                                aria-label="Editar"
                                                colorScheme="blue"
                                                size="sm"
                                                icon={<EditIcon />}
                                                onClick={() => handleOpenModal(item)}
                                            />
                                            <IconButton
                                                id={`btn-delete-item-${item.id}`}
                                                aria-label="Excluir"
                                                colorScheme="red"
                                                size="sm"
                                                icon={<DeleteIcon />}
                                                onClick={() => handleDelete(item.id!)}
                                            />
                                        </Flex>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            )}

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
                <ModalOverlay />
                <ModalContent id="modal-item">
                    <ModalHeader id="modal-item-header">
                        {editingItem ? "Editar Item" : "Novo Item"}
                    </ModalHeader>
                    <ModalCloseButton id="btn-close-item" />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={4}>
                            <Box>
                                <RequiredLabel>Nome</RequiredLabel>
                                <Input
                                    id="input-item-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <FormLabel>Descrição</FormLabel>
                                <Input
                                    id="input-item-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <FormLabel>Preço Unitário</FormLabel>
                                <Input
                                    id="input-item-unitprice"
                                    type="number"
                                    min={0}
                                    value={unitPrice}
                                    onChange={(e) =>
                                        setUnitPrice(e.target.value ? Number(e.target.value) : "")
                                    }
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <FormLabel>Estoque Atual</FormLabel>
                                <Input
                                    id="input-item-stock"
                                    type="number"
                                    min={0}
                                    value={stockQuantity}
                                    onChange={(e) =>
                                        setStockQuantity(e.target.value ? Number(e.target.value) : "")
                                    }
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <HStack spacing={1}>
                                    <FormLabel mb={0}>Estoque Mínimo</FormLabel>
                                    <Tooltip
                                        label="Ao atingir o estoque mínimo, o sistema irá alertá-lo sobre a necessidade de reposição deste item."
                                        hasArrow
                                        placement="top"
                                    >
                                        <Icon
                                            as={QuestionIcon}
                                            color="teal.500"
                                            cursor="pointer"
                                            boxSize={4}
                                        />
                                    </Tooltip>
                                </HStack>
                                <Input
                                    id="input-item-minstock"
                                    type="number"
                                    min={0}
                                    value={minStockQuantity}
                                    onChange={(e) =>
                                        setMinStockQuantity(
                                            e.target.value ? Number(e.target.value) : ""
                                        )
                                    }
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <HStack spacing={1}>
                                    <FormLabel mb={0}>Limite de Movimentação</FormLabel>
                                    <Tooltip
                                        label="Define a quantidade máxima de saídas permitidas por movimentação."
                                        hasArrow
                                        placement="top"
                                    >
                                        <Icon
                                            as={QuestionIcon}
                                            color="teal.500"
                                            cursor="pointer"
                                            boxSize={4}
                                        />
                                    </Tooltip>
                                </HStack>
                                <Input
                                    id="input-item-limit"
                                    type="number"
                                    min={0}
                                    value={movementLimit}
                                    onChange={(e) =>
                                        setMovementLimit(e.target.value ? Number(e.target.value) : "")
                                    }
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <HStack spacing={1}>
                                    <FormLabel mb={0}>Data de Validade</FormLabel>
                                    <Tooltip
                                        label="O sistema alertará ao atingir a data de validade, se houver."
                                        hasArrow
                                        placement="top"
                                    >
                                        <Icon
                                            as={QuestionIcon}
                                            color="teal.500"
                                            cursor="pointer"
                                            boxSize={4}
                                        />
                                    </Tooltip>
                                </HStack>
                                <Input
                                    id="input-item-expiration"
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    mb={3}
                                />
                            </Box>

                            <Box>
                                <RequiredLabel>Categoria</RequiredLabel>
                                <Select
                                    id="select-item-category"
                                    placeholder="Selecione a categoria"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    mb={3}
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {`${c.id} - ${c.description}`}
                                        </option>
                                    ))}
                                </Select>
                            </Box>

                            <Box>
                                <RequiredLabel>Fornecedor</RequiredLabel>
                                <Select
                                    id="select-item-supplier"
                                    placeholder="Selecione o fornecedor"
                                    value={supplierId}
                                    onChange={(e) => setSupplierId(Number(e.target.value))}
                                    mb={3}
                                >
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {`${s.id} - ${s.name}`}
                                        </option>
                                    ))}
                                </Select>
                            </Box>

                            <Box>
                                <FormLabel>Usuário</FormLabel>
                                <Input
                                    id="input-item-user"
                                    value={user ? `${user.id} - ${user.name}` : ""}
                                    isReadOnly
                                    bg="gray.100"
                                    color="gray.700"
                                    cursor="not-allowed"
                                />
                            </Box>
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button id="btn-cancel-item" variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            id="btn-save-item"
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
