import axios from 'axios';
import {parseCookies} from "nookies"
import { setToken } from './auth';


const{ "auth_token": token } = parseCookies()

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

if(token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", {email, password})

      setToken(response.data.token)
    } catch (error) {
      console.error("erro inesperado:", error)
    }
}