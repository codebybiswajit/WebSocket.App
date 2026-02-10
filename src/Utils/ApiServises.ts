import axios, { type AxiosInstance } from 'axios';

export const config = {
    appUrl: import.meta.env.VITE_APP_URL ?? 'http://localhost:5173',
    apiUrl: import.meta.env.VITE_API_URL ?? 'https://localhost:7130',
    mode: import.meta.env.MODE,
    isProd: import.meta.env.PROD,
} as const;

export default function createAxiosInstance(
    { contentType = 'application/json' }: { contentType?: string } = {}
): AxiosInstance {
    return axios.create({
        baseURL: config.apiUrl,
        withCredentials: true, // if using cookies/sessions
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
        },
    });
}

