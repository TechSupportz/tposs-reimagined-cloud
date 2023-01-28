import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { MantineProvider } from "@mantine/core"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
            fontFamily: "Lato, sans-serif",
            headings: { fontFamily: "Raleway, sans-serif" },
            colors: {
                brand: [
                    "#ffe5eb",
                    "#fcb7c5",
                    "#f58a9b",
                    "#ef5c6e",
                    "#e93052",
                    "#d01845",
                    "#a3103f",
                    "#750934",
                    "#480424",
                    "#1e000f",
                ],
            },
            primaryColor: "brand",
            primaryShade: 3,
        }}>
        <App />
    </MantineProvider>,
)
