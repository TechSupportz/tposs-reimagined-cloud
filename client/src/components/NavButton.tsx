import {
    UnstyledButton,
    Title,
    Group,
    Flex,
    MediaQuery,
    Box,
} from "@mantine/core"
import React, { ReactNode } from "react"
import { useHover } from "@mantine/hooks"
import { Inventory } from "@styled-icons/material-rounded"
import { StyledIcon } from "@styled-icons/styled-icon"

interface NavButtonProps {
    text: string
    icon: JSX.Element
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
            sx={theme => ({
                borderRadius: theme.radius.lg,
                backgroundColor: props.selected
                    ? theme.colors.brand[0]
                    : props.selected === undefined
                    ? theme.colors.brand[0]
                    : "transparent",
                "&:hover": {
                    backgroundColor:
                        props.selected === undefined
                            ? theme.colors.brand[1]
                            : theme.colors.brand[0],
                },
                "&:active": {
                    backgroundColor:
                        props.selected === undefined ?  "#fb9db0" : "#ffccd6",
                },
            })}>
            <Flex w="100%" p="sm" align="center" gap="md">
                {props.icon}

                <Title
                    w="min"
                    sx={theme => ({
                        fontSize: "1em",

                        [theme.fn.smallerThan("lg")]: {
                            fontSize: "0.85em",
                        },
                    })}>
                    {props.text}
                </Title>
            </Flex>
        </UnstyledButton>
    )
}

export default NavButton
