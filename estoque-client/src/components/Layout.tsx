import { Flex, Box, chakra, VStack, useToast, Button } from "@chakra-ui/react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

export default function Layout() {

    const navigate = useNavigate();
    const toast = useToast();

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

        navigate("/login");
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
                        <NavItem to="/">Início</NavItem>
                        <NavItem to="/movements">Movimentações</NavItem>
                        <NavItem to="/items">Itens</NavItem>
                        <NavItem to="/categories">Categorias</NavItem>
                        <NavItem to="/persons">Pessoas</NavItem>
                        <NavItem to="/suppliers">Fornecedores</NavItem>
                        <NavItem to="/users">Usuários</NavItem>
                    </VStack>

                    <Button
                        mt={6}
                        colorScheme="red"
                        variant="solid"
                        w="full"
                        onClick={handleLogout}
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