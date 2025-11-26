// src/services/authService.js
const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    async register(userData) {
        try {
            console.log('Enviando datos de registro:', {
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                paymentMethod: {
                    cardHolderName: userData.paymentMethod.cardHolderName,
                    cardBrand: userData.paymentMethod.cardBrand,
                    cardNumber: userData.paymentMethod.cardNumber.slice(-4)
                }
            });

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData.name,
                    surname: userData.surname,
                    phone: userData.phone,
                    address: userData.address,
                    email: userData.email,
                    password: userData.password,
                    paymentMethod: {
                        cardHolderName: userData.paymentMethod.cardHolderName,
                        cardNumber: userData.paymentMethod.cardNumber,
                        cardBrand: userData.paymentMethod.cardBrand,
                        expirationDate: userData.paymentMethod.expirationDate,
                        cvv: userData.paymentMethod.cvv
                    }
                }),
            });


            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();

            }

            if (!response.ok) {
                const errorMessage = typeof data === 'string' ? data : (data.message || data.error || JSON.stringify(data));
                console.error('Error del servidor:', errorMessage);
                throw new Error(errorMessage);
            }

            if (data.token) {
                localStorage.setItem('token', data.token);

                // ← AGREGAR: Guardar userId si viene en la respuesta
                if (data.userId) {
                    localStorage.setItem('userId', data.userId.toString());
                }

                localStorage.setItem('user', JSON.stringify({
                    email: data.email,
                    name: data.name,
                    surname: data.surname,
                    role: data.role || 'USER'
                }));

                if (data.role) {
                    localStorage.setItem('userRole', data.role);
                }
            }

            return data;

        } catch (error) {
            console.error('❌ Error en register:', error);
            console.error('❌ Stack:', error.stack);
            throw error;
        }
    },

    async login(email, password) {
        try {

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });


            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                const errorMessage = typeof data === 'string' ? data : (data.message || data.error || 'Credenciales inválidas');
                console.error('Error del servidor:', errorMessage);
                throw new Error(errorMessage);
            }

            if (data.token) {
                localStorage.setItem('token', data.token);


                if (data.userId) {
                    localStorage.setItem('userId', data.userId.toString());
                } else {
                    console.error('NO SE RECIBIÓ userId del backend');
                    console.error('Respuesta completa:', data);
                }


                localStorage.setItem('user', JSON.stringify({
                    email: data.email,
                    name: data.name,
                    surname: data.surname,
                    role: data.role || 'USER',
                    userId: data.userId
                }));

                // Guardar role
                if (data.role) {
                    localStorage.setItem('userRole', data.role);
                }


            }

            return data;

        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiration = payload.exp * 1000;
            return Date.now() < expiration;
        } catch (error) {
            return false;
        }
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'ADMIN';
    },

    getUserId: () => {
        const userId = localStorage.getItem('userId');
        if (userId && userId !== 'null' && userId !== 'undefined') {
            return userId;
        }

        const user = authService.getCurrentUser();
        if (user && user.userId) {
            return user.userId.toString();
        }

        // Como último recurso, intentar decodificar del token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.userId) {
                    return payload.userId.toString();
                }
            } catch (error) {
                console.error('Error decodificando token:', error);
            }
        }

        console.error('No se pudo obtener userId de ninguna fuente');
        return null;
    },

    getUserRole: () => {
        const role = localStorage.getItem('userRole');
        return role;
    }
};

export const authFetch = async (url, options = {}) => {
    const token = authService.getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
    }

    return response;
};