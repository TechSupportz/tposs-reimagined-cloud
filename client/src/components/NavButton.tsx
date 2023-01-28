import { UnstyledButton, Title, Group, Flex } from "@mantine/core"
import Icon from "react-material-symbols/rounded"
import React, { ReactNode } from "react"
import { SymbolCodepoints } from "react-material-symbols/dist/types"
import { useHover } from "@mantine/hooks"

interface NavButtonProps {
    text: string
    icon: SymbolCodepoints
    onClick: () => void
    selected?: boolean
}

const NavButton = (props: NavButtonProps) => {
    return (
        <UnstyledButton
            px="sm"
            w="100%"
            h={64}
            onClick={props.onClick}
            sx={(theme) => ({
                borderRadius: theme.radius.lg,
                backgroundColor: props.selected ? theme.colors.brand[0] : "transparent",
                "&:hover": {
                    backgroundColor: theme.colors.brand[0],
                },
            })}>
            <Flex p="sm" align="center" gap="md">
                <Icon
                    color="#ef5c6e"
                    icon={props.icon}
                    weight={500}
                    size={28}
                />
                <Title w="min" size="1em">
                    {props.text}
                </Title>
            </Flex>
        </UnstyledButton>
    )
}

export default NavButton
