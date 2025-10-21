import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
    colors: {
        primary: {
            500: "#319795", // teal.500 padrão
        },
        secondary: {
            600: "#3182CE", // blue.600 padrão
        },
    },
    styles: {
        global: {
            body: {
                bg: "gray.50",
                color: "gray.800",
            },
        },
    },
})