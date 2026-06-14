import {apiService} from './api';

export const vesteService = {
    async createProfile(profileData) {
        return apiService.post('/veste-profiles/', profileData, true);
    },

    async getAllProfiles() {
        return apiService.get('/veste-profiles/', true);
    },

    async getProfileById(profileId) {
        return apiService.get(`/veste-profiles/${profileId}`, true);
    },

    async getProfilesByUser(userId) {
        return apiService.get(`/veste-profiles/user/${userId}`, true);
    },

    async updateProfile(profileId, profileData) {
        return apiService.put(`/veste-profiles/${profileId}`, profileData, true);
    },

    async deleteProfile(profileId) {
        return apiService.delete(`/veste-profiles/${profileId}`, true);
    },
    validateProfileData(profileData) {
        return {
            user_id: profileData.user_id,
            profile_name: profileData.profileName || 'Profil Principal',
            tour_poitrine: parseFloat(profileData.tourPoitrine) || null,
            tour_taille: parseFloat(profileData.tourTaille) || null,
            tour_hanches: parseFloat(profileData.tourHanches) || null,
            largeur_epaules: parseFloat(profileData.largeurEpaules) || null,
            longueur_manche: parseFloat(profileData.longueurManche) || null,
            longueur_veste: parseFloat(profileData.longueurVeste) || null,
            type_revers: profileData.typeRevers || 'notch',
            boutons: parseInt(profileData.boutons) || 2,
            poches: profileData.poches || 'flap',
            ventriere: profileData.ventriere || 'cote'
        };
    },
    formatProfileForDisplay(backendData) {
        return {
            id: backendData.id,
            profileName: backendData.profile_name,

            tourPoitrine: backendData.tour_poitrine?.toString() || '',
            tourTaille: backendData.tour_taille?.toString() || '',
            tourHanches: backendData.tour_hanches?.toString() || '',
            largeurEpaules: backendData.largeur_epaules?.toString() || '',
            longueurManche: backendData.longueur_manche?.toString() || '',
            longueurVeste: backendData.longueur_veste?.toString() || '',

            typeRevers: backendData.type_revers,
            boutons: backendData.boutons?.toString() || '2',
            poches: backendData.poches || 'flap',
            ventriere: backendData.ventriere || 'cote'
        };
    },
    async createDefaultProfiles(userId) {
        const templates = [
            { profile_name: 'Veste Classique', tour_poitrine: 96, tour_taille: 84, tour_hanches: 98, largeur_epaules: 45, longueur_manche: 64, longueur_veste: 72, type_revers: 'notch', boutons: 2, poches: 'flap', ventriere: 'centrale' },
            { profile_name: 'Veste Slim', tour_poitrine: 92, tour_taille: 80, tour_hanches: 94, largeur_epaules: 44, longueur_manche: 63, longueur_veste: 70, type_revers: 'peak', boutons: 2, poches: 'besom', ventriere: 'cote' },
            { profile_name: 'Veste Décontractée', tour_poitrine: 100, tour_taille: 88, tour_hanches: 102, largeur_epaules: 46, longueur_manche: 65, longueur_veste: 74, type_revers: 'shawl', boutons: 1, poches: 'patch', ventriere: 'aucune' },
            { profile_name: 'Veste Business', tour_poitrine: 98, tour_taille: 86, tour_hanches: 100, largeur_epaules: 45.5, longueur_manche: 64.5, longueur_veste: 73, type_revers: 'notch', boutons: 3, poches: 'flap', ventriere: 'cote' },
        ];
        for (const t of templates) {
            await apiService.post('/veste-profiles/', { user_id: userId, ...t }, true);
        }
    }
};

export default vesteService;
