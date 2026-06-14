import { apiService, tokenService } from './api';
import { decodeJWT } from "../utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
    async register(userData) {
        try {
            const result = await apiService.post('/register', userData);
            console.log(' Inscription réussie:', result.message);
            return result;
        } catch (error) {
            console.error(' Erreur d\'inscription:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const result = await apiService.post('/login', credentials);
            console.log(' Connexion réussie:', result.message);

            if (result.data && result.data.access_token) {
                await tokenService.setToken(result.data.access_token);
                const decodedToken = decodeJWT(result.data.access_token);
                const { email, firstName, lastName, sub, role } = decodedToken;
                await this.setUser({ email, firstName, lastName, id: sub, role });
            }
            return result;
        } catch (error) {
            console.error(' Erreur de connexion:', error);
            throw error;
        }
    },


    async logout() {
        try {
            // On vérifie si on a un token avant d'appeler le serveur
            const token = await tokenService.getToken();
            if (token) {
                await apiService.post('/logout', {}, true);
                console.log(' Déconnexion réussie côté serveur');
            }
        } catch (error) {
            console.log(' Déconnexion serveur échouée ou token expiré, continuation...');
        } finally {
            // Quoi qu'il arrive, on supprime tout localement
            await tokenService.removeToken();
            await this.removeUser();
        }
    },

    async getProfile() {
        try {
            const result = await apiService.get('/me', true);
            console.log(' Profil récupéré:', result.message);
            return result;
        } catch (error) {
            console.error(' Erreur récupération profil:', error);
            throw error;
        }
    },

    async refreshToken() {
        try {
            const result = await apiService.post('/refresh', {}, true);
            console.log(' Token rafraîchi:', result.message);

            if (result.data && result.data.token) {
                await tokenService.setToken(result.data.token);
            }
            return result;
        } catch (error) {
            console.error(' Erreur rafraîchissement token:', error);
            throw error;
        }
    },

    async validateToken() {
        try {
            const result = await apiService.post('/validate-token', {}, true);
            // ✅ Correct: empty object for data, true for requiresAuth
            console.log(' Token validé:', result.message);
            return result;
        } catch (error) {
            console.error(' Erreur validation token:', error);
            throw error;
        }
    },

    async updateProfile(userData) {
        try {
            const result = await apiService.put('/profile', userData, true);
            console.log(' Profil mis à jour:', result.message);
            return result;
        } catch (error) {
            console.error(' Erreur mise à jour profil:', error);
            throw error;
        }
    },

    async changePassword(passwordData) {
        try {
            const result = await apiService.put('/change-password', passwordData, true);
            console.log(' Mot de passe changé:', result.message);
            return result;
        } catch (error) {
            console.error(' Erreur changement mot de passe:', error);
            throw error;
        }
    },

    async checkEmail(email) {
        try {
            const result = await apiService.post('/check-email', { email });
            console.log(' Email vérifié:', result.message);
            return result;
        } catch (error) {
            console.error(' Erreur vérification email:', error);
            throw error;
        }
    },

    // --- Gestion de l'état local (Storage) ---

    async isAuthenticated() {
        return await tokenService.isAuthenticated();
    },

    async getCurrentToken() {
        return await tokenService.getToken();
    },

    async getCurrentUser() {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    async getCurrentUserId() {
        const user = await this.getCurrentUser();
        return user ? user.id : 0;
    },

    async setUser(user) {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            console.log(' Utilisateur stocké avec succès');
        } catch (error) {
            console.error(' Erreur d\'enregistrement de l\'utilisateur:', error);
            throw error;
        }
    },

    async removeUser() {
        try {
            await AsyncStorage.removeItem('user');
            console.log('🔐 Infos utilisateur supprimées localement');
        } catch (error) {
            console.error(' Erreur de suppression de l\'utilisateur:', error);
            throw error;
        }
    },
};

export default authService;