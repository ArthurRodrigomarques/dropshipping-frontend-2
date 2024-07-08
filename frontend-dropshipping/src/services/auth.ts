import { parseCookies, setCookie } from "nookies"

export const setToken = (token: string) => {
    setCookie(null, 'token', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/", 
    })
}

export const getToken = () => {
    const cookies = parseCookies()
    return cookies.token || null
}