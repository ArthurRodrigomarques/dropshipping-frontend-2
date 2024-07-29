// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333',
});

export const fetchProducts = async (query: string) => {
    let url = `/products?query=${query}`;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(query)) {
        url = `/get-unique-product/${query}`;
    }

    const response = await api.get(url);
    return response.data;
};

export default api;
