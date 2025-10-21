import { useState, useEffect } from "react"
import { Flex, Select, Input, Button } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"

interface FieldOption<T> {
    key: keyof T
    label: string
}

interface SearchBarProps<T> {
    data: T[]
    fields: FieldOption<T>[]
    onSearch: (results: T[]) => void
}

export default function SearchBar<T extends object>({
    data,
    fields,
    onSearch,
}: SearchBarProps<T>) {
    const [selectedField, setSelectedField] = useState<string>(fields[0]?.key as string)
    const [query, setQuery] = useState("")

    useEffect(() => {
        // pesquisa automática conforme digita (ou troque para botão)
        handleSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, selectedField])

    const handleSearch = () => {
        if (!query.trim()) {
            onSearch(data)
            return
        }

        const filtered = data.filter((item) => {
            const value = String(item[selectedField as keyof T] ?? "").toLowerCase()
            return value.includes(query.toLowerCase())
        })

        onSearch(filtered)
    }

    return (
        <Flex gap={3} mb={4} align="center">
            <Select
                w="200px"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
            >
                {fields.map((f) => (
                    <option key={String(f.key)} value={String(f.key)}>
                        {f.label}
                    </option>
                ))}
            </Select>

            <Input
                placeholder="Pesquisar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <Button colorScheme="teal" leftIcon={<SearchIcon />} onClick={handleSearch}>
                Buscar
            </Button>
        </Flex>
    )
}
