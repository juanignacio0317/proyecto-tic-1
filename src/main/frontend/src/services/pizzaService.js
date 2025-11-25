import { authFetch } from './authService';

const API_URL = 'http://localhost:8080/api';

export const pizzaService = {
    async createPizza(pizzaData) {
        const response = await authFetch(`${API_URL}/create/pizza`, {
            method: 'POST',
            body: JSON.stringify(pizzaData),
        });

        const text = await response.text(); // leemos siempre el cuerpo

        if (!response.ok) {
            console.error('Error backend pizza:', response.status, text);
            throw new Error(text || `Error al crear la pizza (status ${response.status})`);
        }

        // si el backend devuelve JSON:
        return text ? JSON.parse(text) : {};
    },
};
