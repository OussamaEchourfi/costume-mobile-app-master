import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import Themedtext from "../../../components/Themedtext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import vesteService from "../../../Services/VesteService";
import authService from "../../../Services/authService";

const VesteProfile = () => {
    const [vestes, setVestes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVestes();
    }, []);

    const fetchVestes = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Récupérer l'utilisateur connecté
            const user = await authService.getCurrentUser();

            if (!user || !user.id) {
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }

            const response = await vesteService.getProfilesByUser(user.id);
            let profilesArray = response?.data || (Array.isArray(response) ? response : []);

            // Seed 4 defaults if none exist
            if (!profilesArray || profilesArray.length === 0) {
                await vesteService.createDefaultProfiles(user.id);
                const afterSeed = await vesteService.getProfilesByUser(user.id);
                profilesArray = afterSeed?.data || (Array.isArray(afterSeed) ? afterSeed : []);
            }

            setVestes(profilesArray);

        } catch (err) {
            console.error('Error fetching vestes:', err);
            setError(err.message || 'Impossible de charger vos profils');
            setVestes([]);
            Alert.alert('Erreur', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => fetchVestes();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Themedtext style={styles.headerTitle}>Mes Profils Veste</Themedtext>
                <TouchableOpacity onPress={handleRefresh} disabled={loading}>
                    <Ionicons name="refresh" size={24} color={loading ? "#cccccc" : "#1e3a8a"} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#1e3a8a" />
                        <Text style={styles.loadingText}>Chargement de vos mesures...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerContent}>
                        <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                            <Text style={styles.retryButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                ) : vestes.length === 0 ? (
                    <View style={styles.centerContent}>
                        <MaterialCommunityIcons name="coat-rack" size={64} color="#cccccc" />
                        <Themedtext style={styles.emptyText}>Aucun profil trouvé</Themedtext>
                        <Text style={styles.emptySubtext}>Créez votre premier profil de mesures pour continuer.</Text>
                    </View>
                ) : (
                    vestes.map((veste) => (
                        <TouchableOpacity
                            key={veste.id}
                            style={styles.card}
                            onPress={() => router.push({
                                pathname: `/MainApplication/Profiles/VesteDetails`,
                                params: { id: veste.id }
                            })}
                        >
                            <View style={styles.cardHeader}>
                                <Ionicons name="shirt" size={24} color="#1e3a8a" style={styles.icon} />
                                <View style={styles.info}>
                                    <Text style={styles.name}>{veste.profile_name || 'Sans nom'}</Text>
                                    <Text style={styles.description}>Modèle : {veste.type_revers} - {veste.boutons} boutons</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.pillButton}
                onPress={() => router.push('/MainApplication/Profiles/Create/CreateVeste')}
            >
                <Ionicons name="add" size={24} color="#ffffff" />
                <Text style={styles.pillText}>Nouveau Profil</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 24 },
    headerTitle: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
    scrollContent: { padding: 24, paddingBottom: 140 },
    centerContent: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 },
    loadingText: { marginTop: 10, color: "#64748b" },
    errorText: { color: "#ef4444", marginBottom: 20 },
    retryButton: { backgroundColor: "#1e3a8a", padding: 10, borderRadius: 8 },
    retryButtonText: { color: "#fff", fontWeight: "bold" },
    emptyText: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    emptySubtext: { color: "#64748b", textAlign: "center", marginTop: 5 },
    card: { backgroundColor: "#ffffff", borderRadius: 22, paddingVertical: 22, paddingHorizontal: 18, marginBottom: 14, borderWidth: 1, borderColor: "#e2e8f0", elevation: 6, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
    cardHeader: { flexDirection: "row", alignItems: "center" },
    icon: { marginRight: 16, fontSize: 28 },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
    description: { fontSize: 14, color: "#475569", marginTop: 4 },
    pillButton: { position: "absolute", bottom: 30, right: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#1e3a8a", paddingHorizontal: 22, paddingVertical: 16, borderRadius: 32, elevation: 6, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    pillText: { color: "#fff", fontWeight: "800", marginLeft: 8 }
});

export default VesteProfile;