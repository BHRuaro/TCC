import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Input,
    chakra,
    useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { login } from "../services/AuthService"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!username.trim() || !password.trim()) {
            toast({
                title: "Campos obrigatórios",
                description: "Preencha usuário e senha para continuar.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        setLoading(true)
        try {
            const data = await login(username, password)

            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)
            localStorage.setItem("user", JSON.stringify({
                id: data.userId,
                name: data.name
            }))

            toast({ title: "Login realizado com sucesso!", status: "success" })
            setTimeout(() => navigate("/"), 800)
        } catch (err: any) {
            localStorage.clear()
            toast({
                title: "Erro no login",
                description: err.message || "Não foi possível autenticar",
                status: "error",
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }


    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
            <Box bg="white" p={8} rounded="xl" shadow="lg" w="full" maxW="md">
                <Flex justify="center" mb={6}>
                    <chakra.img src={logo} alt="Logo" height="60px" objectFit="contain" />
                </Flex>

                <Heading as="h2" size="lg" textAlign="center" mb={6} color="teal.600">
                    Acesso ao Sistema
                </Heading>

                <chakra.form onSubmit={handleSubmit}>
                    <Box mb={4}>
                        <Text mb={2} fontWeight="medium">
                            Usuário
                        </Text>
                        <Input
                            type="text"
                            placeholder="Digite seu usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            borderColor="gray.300"
                            _focus={{ outline: "2px solid", outlineColor: "teal.400" }}
                            id="input-username"
                        />
                    </Box>

                    <Box mb={6}>
                        <Text mb={2} fontWeight="medium">
                            Senha
                        </Text>
                        <Input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            borderColor="gray.300"
                            _focus={{ outline: "2px solid", outlineColor: "teal.400" }}
                            id="input-password"
                        />
                    </Box>

                    <Button
                        type="submit"
                        colorScheme="teal"
                        w="full"
                        size="lg"
                        fontWeight="bold"
                        isLoading={loading}
                    >
                        Entrar
                    </Button>
                </chakra.form>

                <Text textAlign="center" mt={6} color="gray.500" fontSize="sm">
                    © {new Date().getFullYear()} Sistema de Estoque — UTFPR
                </Text>
            </Box>
        </Flex>
    )
}