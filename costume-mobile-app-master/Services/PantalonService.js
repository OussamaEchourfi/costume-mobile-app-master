import { apiService } from './api';

export const PantalonService = {
    async createProfile(profileData) {
        return apiService.post('/pantalons/', profileData, true);
    },

    async getAllProfiles() {
        return apiService.get('/pantalons/', true);
    },

    async getProfileById(profileId) {
        return apiService.get(`/pantalons/${profileId}`, true);
    },

    async getProfilesByUser(userId) {
        return apiService.get(`/pantalons/user/${userId}`, true);
    },

    async updateProfile(profileId, profileData) {
        return apiService.put(`/pantalons/${profileId}`, profileData, true);
    },

    async deleteProfile(profileId) {
        return apiService.delete(`/pantalons/${profileId}`, true);
    },

    validateProfileData(profileData) {
        return {
            user_id: profileData.user_id,
            profile_name: profileData.profile_name || 'Profil Pantalon',
            tour_taille: parseFloat(profileData.tour_taille) || null,
            tour_hanches: parseFloat(profileData.tour_hanches) || null,
            tour_cuisse: parseFloat(profileData.tour_cuisse) || null,
            tour_genou: parseFloat(profileData.tour_genou) || null,
            tour_cheville: parseFloat(profileData.tour_cheville) || null,
            longueur_entrejambes: parseFloat(profileData.longueur_entrejambes) || null,
            longueur_totale: parseFloat(profileData.longueur_totale) || null,
            coupe: profileData.coupe || 'regular',
            revers: profileData.revers || 'non',
            type_ceinture: profileData.type_ceinture || 'classique'
        };
    },

    formatProfileForDisplay(backendData) {
        return {
            id: backendData.id,
            profile_name: backendData.profile_name,

            tour_taille: backendData.tour_taille?.toString() || '',
            tour_hanches: backendData.tour_hanches?.toString() || '',
            tour_cuisse: backendData.tour_cuisse?.toString() || '',
            tour_genou: backendData.tour_genou?.toString() || '',
            tour_cheville: backendData.tour_cheville?.toString() || '',
            longueur_entrejambes: backendData.longueur_entrejambes?.toString() || '',
            longueur_totale: backendData.longueur_totale?.toString() || '',

            coupe: backendData.coupe || 'regular',
            revers: backendData.revers || 'non',
            type_ceinture: backendData.type_ceinture || 'classique'
        };
    }
};

export default PantalonService;