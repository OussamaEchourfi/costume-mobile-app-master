import { apiService } from './api'; // Assurez-vous que le chemin est correct

export const UserService = {
    async getAllUsers() {
        try {
            return await apiService.get('/users', true);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère le profil de l'utilisateur actuellement connecté
     */
    async getCurrentUser() {
        try {
            return await apiService.get('/users/current', true);
        } catch (error) {
            throw error;
        }
    },
    async getUserById(id) {
        try {
            return await apiService.get(`/users/${id}`, true);
        } catch (error) {
            throw error;
        }
    },
    async updateUser(id, userData) {
        try {
            // Correspond à la méthode update du UserController (PUT)
            return await apiService.put(`/users/${id}`, userData, true);
        } catch (error) {
            throw error;
        }
    },
    async deleteUser(id) {
        try {
            return await apiService.delete(`/users/${id}`, true);
        } catch (error) {
            throw error;
        }
    },
};
export default UserService;