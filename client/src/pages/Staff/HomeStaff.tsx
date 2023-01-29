import React from "react"
import useAppStore from "../../app/Store"
import { Text } from "@mantine/core"

const HomeStaff = () => {
    const user = useAppStore(state => state.userInfo)

    return <Text>Hello {user?.name}</Text>
}

export default HomeStaff
