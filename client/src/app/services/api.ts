import { Fetcher } from "swr"

export const baseUrl = "https://bbw85szuyg.execute-api.us-east-1.amazonaws.com"

export const fetcher = (url: string, token: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
        },
    }).then(res => res.json())