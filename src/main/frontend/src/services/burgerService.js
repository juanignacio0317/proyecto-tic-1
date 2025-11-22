// src/services/burgerService.js
import { authFetch } from './authService';

const API_URL = 'http://localhost:8080/api';

export const burgerService = {
    async createBurger(burgerData) {
        const response = await authFetch(`${API_URL}/burgers/create`, {
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
        const response = await fetch(`${API_URL}/burgers/options`);

        if (!response.ok) {
            throw new Error('Error al obtener las opciones');
        }

        return await response.json();
    },

    // Métodos para obtener ingredientes individuales
    async getAllBreads() {
        const response = await fetch(`${API_URL}/breads`);
        if (!response.ok) {
            throw new Error('Error al obtener panes');
        }
        return await response.json();
    },

    async getAllMeats() {
        const response = await fetch(`${API_URL}/meats`);
        if (!response.ok) {
            throw new Error('Error al obtener carnes');
        }
        return await response.json();
    },

    async getAllToppings() {
        const response = await fetch(`${API_URL}/toppings`);
        if (!response.ok) {
            throw new Error('Error al obtener toppings');
        }
        return await response.json();
    },

    async getAllDressings() {
        const response = await fetch(`${API_URL}/dressings`);
        if (!response.ok) {
            throw new Error('Error al obtener aderezos');
        }
        return await response.json();
    }
};