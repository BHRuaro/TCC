import { Flex, Box, chakra, VStack, useToast, Button, Text } from "@chakra-ui/react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

export default function Layout() {
    const navigate = useNavigate()
    const toast = useToast()

    const storedUser = localStorage.getItem("user")
    const user = storedUser ? JSON.parse(storedUser) : null

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("user")

        toast({
            title: "Logout realizado com sucesso",
            status: "info",
            duration: 3000,
            isClosable: true,
        })

        navigate("/login")
    }

    return (
        <Flex direction="column" minH="100vh">
            <Flex
                as="header"
                bg="teal.500"
                color="white"
                align="center"
                justify="space-between"
                px={8}
                py={4}
                boxShadow="md"
            >
                <Flex align="center" gap={4}>
                    <chakra.img
                        src={logo}
                        alt="Logo do sistema"
                        height="50px"
                        objectFit="contain"
                    />
                    <Box fontSize="2xl" fontWeight="bold" letterSpacing="wide">
                        Sistema de Estoque
                    </Box>
                </Flex>

                <Flex align="center" gap={4}>
                    {user && (
                        <Text fontWeight="medium" fontSize="lg" id="hello-user">
                            Olá, {user.name}
                        </Text>
                    )}
                </Flex>
            </Flex>

            <Flex flex="1" bg="gray.50">
                <Flex
                    direction="column"
                    justify="space-between"
                    w="240px"
                    bg="white"
                    boxShadow="md"
                    p={4}
                    borderRight="1px solid"
                    borderColor="gray.200"
                >
                    <VStack align="stretch" gap={4}>
                        <NavItem to="/" id="nav-inicio">Início</NavItem>
                        <NavItem to="/movements" id="nav-movimentacoes">Movimentações</NavItem>
                        <NavItem to="/items" id="nav-itens">Itens</NavItem>
                        <NavItem to="/categories" id="nav-categorias">Categorias</NavItem>
                        <NavItem to="/persons" id="nav-pessoas">Pessoas</NavItem>
                        <NavItem to="/suppliers" id="nav-fornecedores">Fornecedores</NavItem>
                        <NavItem to="/users" id="nav-usuarios">Usuários</NavItem>
                    </VStack>

                    <Button
                        mt={6}
                        colorScheme="red"
                        variant="solid"
                        w="full"
                        onClick={handleLogout}
                        id="button-logout"
                    >
                        Sair
                    </Button>
                </Flex>

                <Box flex="1" p={6}>
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    )
}

const NavItem = chakra(NavLink, {
    base: {
        display: "block",
        px: "12px",
        py: "8px",
        borderRadius: "md",
        fontWeight: "medium",
        textDecoration: "none",
        color: "gray.700",
        transition: "background 0.2s ease",
        _hover: { bg: "teal.100" },
        "&.active": { bg: "teal.200", color: "teal.800" },
    },
})
