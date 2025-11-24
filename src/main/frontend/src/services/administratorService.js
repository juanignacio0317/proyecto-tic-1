import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/api/admin/administrators';

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${authService.getToken()}`
    }
});

export const administratorService = {
    
    createAdministrator: async (adminData) => {
        try {
            const response = await axios.post(API_URL, adminData, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al crear administrador');
        }
    },


    getAllAdministrators: async () => {
        try {
            const response = await axios.get(API_URL, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener administradores');
        }
    },


    getAdministratorById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener administrador');
        }
    },


    deleteAdministrator: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al eliminar administrador');
        }
    }
};