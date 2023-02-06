import {
    MantineThemeOverride,
    PaperStylesParams,
    TabsStylesParams,
} from "@mantine/core"

export const theme: MantineThemeOverride = {
    fontFamily: "Lato, sans-serif",
    headings: { fontFamily: "Raleway, sans-serif" },
    globalStyles: theme => ({
        body: {
            backgroundColor: "#fafafa",
        },
    }),
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
        Tabs: {
            defaultProps: theme => ({
                radius: "md",
            }),
            styles: (theme, params: TabsStylesParams) => ({
                tab: {
                    fontFamily: "Raleway, sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    border: `4px solid ${theme.colors.brand[3]}`,
                    padding: "12px 0",
                },
                tabsList: {
                    columnGap: 16,
                },
            }),
        },
    },
}
