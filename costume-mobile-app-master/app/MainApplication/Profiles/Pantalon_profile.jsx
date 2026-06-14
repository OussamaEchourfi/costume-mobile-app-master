import {
    ScrollView, StyleSheet, Text, TouchableOpacity, View,
    ActivityIndicator, Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../../../Services/api";
import Spacer from "../../../components/Spacer";
import Themedtext from "../../../components/Themedtext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import pantalonService from "../../../Services/PantalonService";
import authService from "../../../Services/authService"; // Ajouté

const PantalonProfile = () => {
    const [pantalons, setPantalons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPantalons();
    }, []);

    const fetchPantalons = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Récupérer l'utilisateur
            const user = await authService.getCurrentUser();
            if (!user?.id) throw new Error("Utilisateur non connecté");

            // 2. Appeler le service par utilisateur
            const response = await pantalonService.getProfilesByUser(user.id);

            // 3. Extraction sécurisée (supporte {data: []} ou [])
            let profilesArray = response?.data || (Array.isArray(response) ? response : []);

            // Seed 4 defaults if none exist
            if (!profilesArray || profilesArray.length === 0) {
                const templates = [
                    { profile_name: 'Pantalon Classique', tour_taille: 84, tour_hanches: 98, tour_cuisse: 56, tour_genou: 40, tour_cheville: 18, longueur_entrejambes: 82, longueur_totale: 106, coupe: 'regular', revers: 'non', type_ceinture: 'classique' },
                    { profile_name: 'Pantalon Slim', tour_taille: 82, tour_hanches: 96, tour_cuisse: 54, tour_genou: 38, tour_cheville: 17, longueur_entrejambes: 81, longueur_totale: 105, coupe: 'slim', revers: 'oui', type_ceinture: 'classique' },
                    { profile_name: 'Pantalon Décontracté', tour_taille: 86, tour_hanches: 100, tour_cuisse: 58, tour_genou: 41, tour_cheville: 19, longueur_entrejambes: 83, longueur_totale: 107, coupe: 'loose', revers: 'non', type_ceinture: 'elastique' },
                    { profile_name: 'Pantalon Business', tour_taille: 85, tour_hanches: 99, tour_cuisse: 57, tour_genou: 40, tour_cheville: 18, longueur_entrejambes: 82, longueur_totale: 106, coupe: 'regular', revers: 'oui', type_ceinture: 'classique' },
                ];
                for (const t of templates) {
                    await apiService.post('/pantalons/', { user_id: user.id, ...t }, true);
                }
                const afterSeed = await pantalonService.getProfilesByUser(user.id);
                profilesArray = afterSeed?.data || (Array.isArray(afterSeed) ? afterSeed : []);
            }

            setPantalons(profilesArray);

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Impossible de charger vos profils');
            setPantalons([]);
            Alert.alert('Erreur', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => fetchPantalons();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Themedtext style={styles.headerTitle}>Mes Profils Pantalon</Themedtext>
                <TouchableOpacity onPress={handleRefresh} disabled={loading}>
                    <Ionicons name="refresh" size={24} color={loading ? "#6B7280" : "#D32F2F"} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#D32F2F" />
                        <Text style={styles.loadingText}>Chargement...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerContent}>
                        <Ionicons name="alert-circle-outline" size={64} color="#D32F2F" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                            <Text style={styles.retryButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                ) : pantalons.length === 0 ? (
                    <View style={styles.centerContent}>
                        <MaterialCommunityIcons name="fencing" size={64} color="#D32F2F" />
                        <Themedtext style={styles.emptyText}>Aucun pantalon</Themedtext>
                        <Text style={styles.emptySubtext}>Créez votre premier profil de mesures.</Text>
                    </View>
                ) : (
                    pantalons.map((pant) => (
                        <TouchableOpacity
                            key={pant.id}
                            style={styles.card}
                            onPress={() => router.push({
                                pathname: `/MainApplication/Profiles/PantalonDetails`,
                                params: { id: pant.id }
                            })}
                        >
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="archive-arrow-down-outline" size={24} color="#D32F2F" style={styles.icon} />
                                <View style={styles.info}>
                                    <Text style={styles.name}>{pant.profile_name || 'Sans nom'}</Text>
                                    <Text style={styles.description}>Coupe : {pant.coupe} • Taille : {pant.tour_taille} cm</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.pillButton}
                onPress={() => router.push('/MainApplication/Profiles/Create/CreatePantalon')}
            >
                <Ionicons name="add" size={24} color="#ffffff" />
                <Text style={styles.pillText}>Nouveau Pantalon</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000000" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "#000000" },
    headerTitle: { fontSize: 20, fontWeight: "800", color: "#D32F2F" },
    scrollContent: { padding: 20, paddingBottom: 110 },
    centerContent: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
    loadingText: { marginTop: 8, color: "#D1D5DB" },
    errorText: { color: "#D32F2F", fontWeight: "800", marginBottom: 15 },
    retryButton: { backgroundColor: "#D32F2F", padding: 10, borderRadius: 8 },
    retryButtonText: { color: "#111111", fontWeight: "800" },
    emptyText: { fontSize: 18, fontWeight: "800", color: "#D32F2F" },
    emptySubtext: { color: "#9CA3AF", textAlign: "center", paddingHorizontal: 20 },
    card: { backgroundColor: "#111111", borderRadius: 18, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#333333', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 8 } },
    cardHeader: { flexDirection: "row", alignItems: "center" },
    icon: { marginRight: 12 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "800", color: "#F5F5F5" },
    description: { fontSize: 14, color: "#D1D5DB", marginTop: 4 },
    pillButton: { position: "absolute", bottom: 30, right: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#D32F2F", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
    pillText: { color: "#111111", fontWeight: "800", marginLeft: 8 },
});

export default PantalonProfile;