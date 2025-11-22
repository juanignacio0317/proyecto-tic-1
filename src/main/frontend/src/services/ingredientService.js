// src/services/ingredientService.js
const API_URL = 'http://localhost:8080/api';

export const ingredientService = {
    // ==================== BREADS ====================
    async getAllBreads() {
        const response = await fetch(`${API_URL}/breads`);
        if (!response.ok) throw new Error('Error al obtener panes');
        return response.json();
    },

    async createBread(data) {
        const response = await fetch(`${API_URL}/breads/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear pan');
        }
        return response.json();
    },

    async updateBreadAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/breads/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateBreadPrice(type, price) {
        const response = await fetch(
            `${API_URL}/breads/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

    // ==================== MEATS ====================
    async getAllMeats() {
        const response = await fetch(`${API_URL}/meats`);
        if (!response.ok) throw new Error('Error al obtener carnes');
        return response.json();
    },

    async createMeat(data) {
        const response = await fetch(`${API_URL}/meats/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear carne');
        }
        return response.json();
    },

    async updateMeatAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/meats/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateMeatPrice(type, price) {
        const response = await fetch(
            `${API_URL}/meats/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

    // ==================== CHEESES ====================
    async getAllCheeses() {
        const response = await fetch(`${API_URL}/cheeses`);
        if (!response.ok) throw new Error('Error al obtener quesos');
        return response.json();
    },

    async createCheese(data) {
        const response = await fetch(`${API_URL}/cheeses/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear queso');
        }
        return response.json();
    },

    async updateCheeseAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/cheeses/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateCheesePrice(type, price) {
        const response = await fetch(
            `${API_URL}/cheeses/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

    // ==================== TOPPINGS ====================
    async getAllToppings() {
        const response = await fetch(`${API_URL}/toppings`);
        if (!response.ok) throw new Error('Error al obtener toppings');
        return response.json();
    },

    async createTopping(data) {
        const response = await fetch(`${API_URL}/toppings/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear topping');
        }
        return response.json();
    },

    async updateToppingAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/toppings/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateToppingPrice(type, price) {
        const response = await fetch(
            `${API_URL}/toppings/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

    // ==================== DRESSINGS (SALSAS) ====================
    async getAllDressings() {
        const response = await fetch(`${API_URL}/dressings`);
        if (!response.ok) throw new Error('Error al obtener salsas');
        return response.json();
    },

    async createDressing(data) {
        const response = await fetch(`${API_URL}/dressings/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear salsa');
        }
        return response.json();
    },

    async updateDressingAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/dressings/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateDressingPrice(type, price) {
        const response = await fetch(
            `${API_URL}/dressings/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },
};