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


    // ==================== SIZES (TAMAÑOS) ====================
    async getAllSizes() {
        const response = await fetch(`${API_URL}/sizes`);
        if (!response.ok) throw new Error('Error al obtener tamaños');
        return response.json();
    },

    async createSize(data) {
        const response = await fetch(`${API_URL}/sizes/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear tamaño');
        }
        return response.json();
    },

    async updateSizeAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/sizes/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateSizePrice(type, price) {
        const response = await fetch(
            `${API_URL}/sizes/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

// ==================== DOUGHS (MASAS) ====================
    async getAllDoughs() {
        const response = await fetch(`${API_URL}/doughs`);
        if (!response.ok) throw new Error('Error al obtener masas');
        return response.json();
    },

    async createDough(data) {
        const response = await fetch(`${API_URL}/doughs/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear masa');
        }
        return response.json();
    },

    async updateDoughAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/doughs/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateDoughPrice(type, price) {
        const response = await fetch(
            `${API_URL}/doughs/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

// ==================== SAUCES (SALSAS) ====================
    async getAllSauces() {
        const response = await fetch(`${API_URL}/sauces`);
        if (!response.ok) throw new Error('Error al obtener salsas');
        return response.json();
    },

    async createSauce(data) {
        const response = await fetch(`${API_URL}/sauces/create`, {
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

    async updateSauceAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/sauces/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateSaucePrice(type, price) {
        const response = await fetch(
            `${API_URL}/sauces/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

// ==================== BEVERAGES (BEBIDAS) ====================
    async getAllBeverages() {
        const response = await fetch(`${API_URL}/beverages`);
        if (!response.ok) throw new Error('Error al obtener bebidas');
        return response.json();
    },

    async createBeverage(data) {
        const response = await fetch(`${API_URL}/beverages/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear bebida');
        }
        return response.json();
    },

    async updateBeverageAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/beverages/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateBeveragePrice(type, price) {
        const response = await fetch(
            `${API_URL}/beverages/${encodeURIComponent(type)}/price?price=${price}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar precio');
    },

// ==================== SIDE ORDERS (ACOMPAÑAMIENTOS) ====================
    async getAllSideOrders() {
        const response = await fetch(`${API_URL}/sideOrders`);
        if (!response.ok) throw new Error('Error al obtener acompañamientos');
        return response.json();
    },

    async createSideOrder(data) {
        const response = await fetch(`${API_URL}/sideOrders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al crear acompañamiento');
        }
        return response.json();
    },

    async updateSideOrderAvailability(type, available) {
        const response = await fetch(
            `${API_URL}/sideOrders/${encodeURIComponent(type)}/availability?available=${available}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) throw new Error('Error al actualizar disponibilidad');
    },

    async updateSideOrderPrice(type, price) {
        const response = await fetch(
            `${API_URL}/sideOrders/${encodeURIComponent(type)}/price?price=${price}`,
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