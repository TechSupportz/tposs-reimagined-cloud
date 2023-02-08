import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { MantineProvider, Tabs, TabsStylesParams } from "@mantine/core"
import { BrowserRouter } from "react-router-dom"
import { PaperStylesParams } from "@mantine/core/lib/Paper"
import { SWRConfig } from "swr"
import { TabStylesNames } from "@mantine/core/lib/Tabs/Tab/Tab"
import { theme } from "./Theme"
import { NotificationsProvider } from "@mantine/notifications"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <SWRConfig
        value={{
            onError: (error, key) => {
                console.log(error)
                console.log("BROKEN")
            },
        }}>
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            withCSSVariables
            theme={theme}>
            <NotificationsProvider position="bottom-right">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </NotificationsProvider>
        </MantineProvider>
    </SWRConfig>,
)
