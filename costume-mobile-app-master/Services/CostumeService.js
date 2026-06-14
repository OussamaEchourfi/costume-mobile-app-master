import { apiService } from './api';

export const costumeService = {

    async createCostume(costumeData) {
        return apiService.post('/costumes', costumeData, true);
    },

    async getAllCostumes() {
        return apiService.get('/costumes', true);
    },

    async getCostumeById(id) {
        return apiService.get(`/costumes/${id}`, true);
    },

    async getCostumesByUser(userId) {
        return apiService.get(`/costumes/user/${userId}`, true);
    },

    async updateCostume(id, costumeData) {
        return apiService.put(`/costumes/${id}`, costumeData, true);
    },

    async deleteCostume(id) {
        return apiService.delete(`/costumes/${id}`, true);
    },

    validateCostumeData(data) {
        return {
            name: data.name || 'Nouveau Costume',
            user_id: data.userId,
            veste_profile_id: data.vesteProfileId || null,
            gilet_id: data.giletId || null,
            pantalon_id: data.pantalonId || null
        };
    },


    formatCostumeForDisplay(backendData) {
        return {
            id: backendData.id,
            name: backendData.name,
            userId: backendData.user_id,


            vesteProfileId: backendData.veste_profile_id,
            giletId: backendData.gilet_id,
            pantalonId: backendData.pantalon_id,


            veste: backendData.veste || null,
            gilet: backendData.gilet || null,
            pantalon: backendData.pantalon || null
        };
    }
};

export default costumeService;