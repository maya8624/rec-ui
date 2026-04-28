interface AppConfig {
    apiBaseUrl: string;
    googleClientId: string
}

export const config: AppConfig ={
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
}