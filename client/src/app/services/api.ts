export const fetcher = (url: string, token: string) => fetch(url, {
  headers: {
	Authorization: `${token}`,
  },
}).then((res) => res.json());