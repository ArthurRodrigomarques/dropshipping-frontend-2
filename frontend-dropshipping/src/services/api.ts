import axios from 'axios';
import {parseCookies} from "nookies"
import { setToken } from './auth';


const{ "auth_token": token } = parseCookies()

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

if(token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export const login = async (email: string, password: string, name: string, accessName: string) => {
    try {
      const response = await api.post("/register", {email, password, name, accessName})

      setToken(response.data.token)
    } catch (error) {
      console.error("erro inesperado:", error)
    }
}