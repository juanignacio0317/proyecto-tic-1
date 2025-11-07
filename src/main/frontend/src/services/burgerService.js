// src/services/burgerService.js
import { authFetch } from './authService';

const API_URL = 'http://localhost:8080/api/burgers';

export const burgerService = {
    async createBurger(burgerData) {
        const response = await authFetch(`${API_URL}/create`, {
            method: 'POST',
            body: JSON.stringify(burgerData)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    },

    async getBurgerOptions() {
        const response = await fetch(`${API_URL}/options`);

        if (!response.ok) {
            throw new Error('Error al obtener las opciones');
        }

        return await response.json();
    }
};