import { apiService } from './api';

export const giletService = {

    async createProfile(profileData) {
        return apiService.post('/gilets/', profileData, true);
    },

    async getAllProfiles() {
        return apiService.get('/gilets/', true);
    },

    async getProfileById(profileId) {
        return apiService.get(`/gilets/${profileId}`, true);
    },

    async getProfilesByUser(userId) {
        return apiService.get(`/gilets/user/${userId}`, true);
    },

    async updateProfile(profileId, profileData) {
        return apiService.put(`/gilets/${profileId}`, profileData, true);
    },

    async deleteProfile(profileId) {
        return apiService.delete(`/gilets/${profileId}`, true);
    },

    validateProfileData(profileData) {
        return {
            user_id: profileData.user_id,

            profile_name: profileData.profileName || 'Profil Principal',

            tour_poitrine: parseFloat(profileData.tourPoitrine) || null,
            tour_taille: parseFloat(profileData.tourTaille) || null,
            longueur_gilet: parseFloat(profileData.longueurGilet) || null,
            largeur_epaules: parseFloat(profileData.largeurEpaules) || null,
            boutons: profileData.boutons || '6',
            poches: profileData.poches || 'passepoil'
        };
    },

    formatProfileForDisplay(backendData) {
        return {
            id: backendData.id,
            profileName: backendData.profile_name,

            tourPoitrine: backendData.tour_poitrine?.toString() || '',
            tourTaille: backendData.tour_taille?.toString() || '',
            longueurGilet: backendData.longueur_gilet?.toString() || '',
            largeur_epaules: backendData.largeur_epaules?.toString() || '',

            boutons: backendData.boutons || '6',
            poches: backendData.poches || 'passepoil',
        };
    },
    async createDefaultProfiles(userId) {
        // Respect backend validation and DB enum: boutons must be '4'|'5'|'6' as STRINGS and poches among 'classique'|'passepoil'|'double'
        const templates = [
            { profile_name: 'Gilet Classique', tour_poitrine: 96, tour_taille: 84, longueur_gilet: 58, largeur_epaules: 43, boutons: '5', poches: 'classique' },
            { profile_name: 'Gilet Slim', tour_poitrine: 92, tour_taille: 80, longueur_gilet: 56, largeur_epaules: 42, boutons: '5', poches: 'passepoil' },
            { profile_name: 'Gilet Décontracté', tour_poitrine: 100, tour_taille: 88, longueur_gilet: 60, largeur_epaules: 44, boutons: '6', poches: 'passepoil' },
            { profile_name: 'Gilet Business', tour_poitrine: 98, tour_taille: 86, longueur_gilet: 59, largeur_epaules: 43.5, boutons: '6', poches: 'classique' },
        ];
        for (const t of templates) {
            await apiService.post('/gilets/', { user_id: userId, ...t }, true);
        }
    }
};

export default giletService;
