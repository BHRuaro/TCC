import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
    colors: {
        primary: {
            500: "#319795",
        },
        secondary: {
            600: "#3182CE",
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