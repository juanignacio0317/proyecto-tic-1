import { authFetch } from './authService';

const API_URL = 'http://localhost:8080/api';

export const pizzaService = {
    async createPizza(pizzaData) {
        const response = await authFetch(`${API_URL}/create/pizza`, {
            method: 'POST',
            body: JSON.stringify(pizzaData),
        });

        const text = await response.text();

        if (!response.ok) {
            console.error('Error backend pizza:', response.status, text);
            throw new Error(text || `Error al crear la pizza (status ${response.status})`);
        }

        return text ? JSON.parse(text) : {};
    },

    async getAllSizes() {
        const response = await fetch(`${API_URL}/sizes`);
        if (!response.ok) {
            throw new Error('Error al obtener tamaños');
        }
        return await response.json();
    },

    async getAllDoughs() {
        const response = await fetch(`${API_URL}/doughs`);
        if (!response.ok) {
            throw new Error('Error al obtener masas');
        }
        return await response.json();
    },

    async getAllSauces() {
        const response = await fetch(`${API_URL}/sauces`);
        if (!response.ok) {
            throw new Error('Error al obtener salsas');
        }
        return await response.json();
    },

    async getAllCheeses() {
        const response = await fetch(`${API_URL}/cheeses`);
        if (!response.ok) {
            throw new Error('Error al obtener quesos');
        }
        return await response.json();
    },

    async getAllToppings() {
        const response = await fetch(`${API_URL}/toppings`);
        if (!response.ok) {
            throw new Error('Error al obtener toppings');
        }
        return await response.json();
    }
};