import {
    MantineThemeOverride,
    PaperStylesParams,
    TabsStylesParams,
} from "@mantine/core"
import { InputStylesParams } from "@mantine/core/lib/Input"
import { DateRangePickerProps } from "@mantine/dates/lib/components/DateRangePicker"
import { CalendarMonth } from "@styled-icons/material-rounded"
import { ReactNode } from "react"

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
        Input: {
            defaultProps: {
                radius: "md",
                variant: "filled",
            },
            styles: (theme, params: InputStylesParams) => ({
                input: {
                    borderWidth: 2,
                    "&:focus": {
                        borderColor: theme.colors.gray[4],
                    },
                },
            }),
        },
        InputWrapper: {
            styles: (theme, params: InputStylesParams) => ({
                label: {
                    fontFamily: "Raleway, sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                },
                required: {
                    color: theme.colors.red[6],
                },
                error: {
                    color: theme.colors.red[6],
                },
                
            }),
        },
        TextInput: {
            defaultProps: {
                size: "md"
            }
        },
        FileInput: {
            defaultProps: {
                size: "md"
            }
        },
        Textarea: {
            defaultProps: {
                size: "md"
            }
        },
        Select: {
            defaultProps: theme => ({
                transition: "scale-y",
                transitionDuration: 200,
                transitionTimingFunction: "ease",
                size: "md"
            }),
        },
        DateRangePicker: {
            defaultProps: theme => ({
                transitionDuration: 200,
                transitionTimingFunction: "ease",
                size: "md",
            }),
            styles: (theme, params) => ({
                weekdayCell: {
                    backgroundColor: theme.white,
                },
            }),
        },
    },
}
