import { Flex, FormLabel, Text } from "@chakra-ui/react"

interface RequiredLabelProps {
    children: React.ReactNode
}

export default function RequiredLabel({ children }: RequiredLabelProps) {
    return (
        <Flex align="center" gap={1}>
            <FormLabel m={0}>{children}</FormLabel>
            <Text as="span" color="red.500">*</Text>
        </Flex>
    )
}