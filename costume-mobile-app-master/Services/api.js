import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
const API_BASE_URL = (Constants?.expoConfig?.extra?.apiUrl) || process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api';
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: 'Erreur serveur'
        }));
        throw errorData;
    }
    return response.json();
};
export const apiService = {
    async get(endpoint, requiresAuth = false) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            if (requiresAuth) {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            console.log(` GET ${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers,
            });

            const result = await handleResponse(response);
            console.log(` GET ${endpoint} réussie`);
            return result;

        } catch (error) {
            console.error(` GET ${endpoint} échouée:`, error);
            throw error;
        }
    },

    async post(endpoint, data = {}, requiresAuth = false) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (requiresAuth) {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            console.log(`📤 POST ${API_BASE_URL}${endpoint}`, data);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const result = await handleResponse(response);
            console.log(` POST ${endpoint} réussie`);
            return result;

        } catch (error) {
            console.error(` POST ${endpoint} échouée:`, error);
            throw error;
        }
    },

    async put(endpoint, data, requiresAuth = false) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (requiresAuth) {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            console.log(`📤 PUT ${API_BASE_URL}${endpoint}`, data);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });

            const result = await handleResponse(response);
            console.log(` PUT ${endpoint} réussie`);
            return result;

        } catch (error) {
            console.error(` PUT ${endpoint} échouée:`, error);
            throw error;
        }
    },

    async delete(endpoint, requiresAuth = false) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (requiresAuth) {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            console.log(` DELETE ${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers,
            });

            const result = await handleResponse(response);
            console.log(` DELETE ${endpoint} réussie`);
            return result;

        } catch (error) {
            console.error(` DELETE ${endpoint} échouée:`, error);
            throw error;
        }
    }
};
export const tokenService = {
    async getToken() {
        try {
            return await AsyncStorage.getItem('authToken');
        } catch (error) {
            console.error('Erreur de récupération du token:', error);
            return null;
        }
    },

    async setToken(token) {
        try {
            await AsyncStorage.setItem('authToken', token);
            console.log(' Token stocké avec succès');
        } catch (error) {
            console.error('Erreur d\'enregistrement du token:', error);
            throw error;
        }
    },

    async removeToken() {
        try {
            await AsyncStorage.removeItem('authToken');
            console.log('🔐 Token supprimé avec succès');
        } catch (error) {
            console.error('Erreur de suppression du token:', error);
            throw error;
        }
    },

    async isAuthenticated() {
        try {
            const token = await AsyncStorage.getItem('authToken');
            return !!token;
        } catch (error) {
            console.error('Erreur de vérification d\'authentification:', error);
            return false;
        }
    },

};

export default apiService;