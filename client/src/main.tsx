import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { MantineProvider } from "@mantine/core"
import { BrowserRouter } from "react-router-dom"
import { PaperStylesParams } from "@mantine/core/lib/Paper"
import { SWRConfig } from "swr"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <SWRConfig
        value={{
            onError: err => {
                console.error(err)
            },
        }}>
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
                components: {
                    Paper: {
                        styles: (theme, params: PaperStylesParams) => ({
                            root: {
                                boxShadow:
                                    params.shadow === "md"
                                        ? "0px 4px 12px rgba(0, 0, 0, 0.1);"
                                        : undefined,
                            },
                        }),
                    },
                },
            }}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MantineProvider>
    </SWRConfig>,
)
