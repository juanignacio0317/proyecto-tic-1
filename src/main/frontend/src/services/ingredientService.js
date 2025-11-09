// src/services/ingredientService.js
import { authFetch } from './authService';

const API_URL = 'http://localhost:8080/api/admin/ingredients';

export const ingredientService = {
    // ==================== BREADS ====================
    async getAllBreads() {
        const response = await authFetch(`${API_URL}/breads`);
        if (!response.ok) throw new Error('Error al obtener panes');
        return response.json();
    },

    async createBread(data) {
        const response = await authFetch(`${API_URL}/breads`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear pan');
        }
        return response.json();
    },

    async updateBreadAvailability(type, available) {
        const response = await authFetch(
            `${API_URL}/breads/${encodeURIComponent(type)}/availability?available=${available}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
        return response.json();
    },

    async updateBreadPrice(type, price) {
        const response = await authFetch(
            `${API_URL}/breads/${encodeURIComponent(type)}/price?price=${price}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
        return response.json();
    },

    // ==================== MEATS ====================
    async getAllMeats() {
        const response = await authFetch(`${API_URL}/meats`);
        if (!response.ok) throw new Error('Error al obtener carnes');
        return response.json();
    },

    async createMeat(data) {
        const response = await authFetch(`${API_URL}/meats`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear carne');
        }
        return response.json();
    },

    async updateMeatAvailability(type, available) {
        const response = await authFetch(
            `${API_URL}/meats/${encodeURIComponent(type)}/availability?available=${available}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
        return response.json();
    },

    async updateMeatPrice(type, price) {
        const response = await authFetch(
            `${API_URL}/meats/${encodeURIComponent(type)}/price?price=${price}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
        return response.json();
    },

    // ==================== CHEESES ====================
    async getAllCheeses() {
        const response = await authFetch(`${API_URL}/cheeses`);
        if (!response.ok) throw new Error('Error al obtener quesos');
        return response.json();
    },

    async createCheese(data) {
        const response = await authFetch(`${API_URL}/cheeses`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear queso');
        }
        return response.json();
    },

    async updateCheeseAvailability(type, available) {
        const response = await authFetch(
            `${API_URL}/cheeses/${encodeURIComponent(type)}/availability?available=${available}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
        return response.json();
    },

    async updateCheesePrice(type, price) {
        const response = await authFetch(
            `${API_URL}/cheeses/${encodeURIComponent(type)}/price?price=${price}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
        return response.json();
    },

    // ==================== TOPPINGS ====================
    async getAllToppings() {
        const response = await authFetch(`${API_URL}/toppings`);
        if (!response.ok) throw new Error('Error al obtener toppings');
        return response.json();
    },

    async createTopping(data) {
        const response = await authFetch(`${API_URL}/toppings`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear topping');
        }
        return response.json();
    },

    async updateToppingAvailability(type, available) {
        const response = await authFetch(
            `${API_URL}/toppings/${encodeURIComponent(type)}/availability?available=${available}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
        return response.json();
    },

    async updateToppingPrice(type, price) {
        const response = await authFetch(
            `${API_URL}/toppings/${encodeURIComponent(type)}/price?price=${price}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
        return response.json();
    },

    // ==================== DRESSINGS (SALSAS) ====================
    async getAllDressings() {
        const response = await authFetch(`${API_URL}/dressings`);
        if (!response.ok) throw new Error('Error al obtener salsas');
        return response.json();
    },

    async createDressing(data) {
        const response = await authFetch(`${API_URL}/dressings`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear salsa');
        }
        return response.json();
    },

    async updateDressingAvailability(type, available) {
        const response = await authFetch(
            `${API_URL}/dressings/${encodeURIComponent(type)}/availability?available=${available}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
        return response.json();
    },

    async updateDressingPrice(type, price) {
        const response = await authFetch(
            `${API_URL}/dressings/${encodeURIComponent(type)}/price?price=${price}`,
            { method: 'PUT' }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
        return response.json();
    },
};