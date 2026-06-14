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
import Spacer from "../../../components/Spacer";
import Themedtext from "../../../components/Themedtext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import costumeService from "../../../Services/CostumeService";
import authService from "../../../Services/authService"; // INDISPENSABLE
import vesteService from "../../../Services/VesteService";
import pantalonService from "../../../Services/PantalonService";
import giletService from "../../../Services/GiletService";

const CostumeProfile = () => {
    const [costumes, setCostumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCostumes();
    }, []);

    const fetchCostumes = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Récupérer l'ID de l'utilisateur connecté
            const user = await authService.getCurrentUser();

            if (!user || !user.id) {
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }

            // 2. Appeler getCostumesByUser au lieu de getAllCostumes
            const response = await costumeService.getCostumesByUser(user.id);

            // 3. Extraction sécurisée des données (format { success, data } ou tableau direct)
            let costumesArray = response?.data || (Array.isArray(response) ? response : []);

            // 4. Seed 4 défauts si aucun costume en liant aux profils existants (veste & pantalon requis côté backend)
            if (!costumesArray || costumesArray.length === 0) {
                // Récupérer des IDs disponibles
                const [vRes, pRes, gRes] = await Promise.all([
                    vesteService.getProfilesByUser(user.id),
                    pantalonService.getProfilesByUser(user.id),
                    giletService.getProfilesByUser(user.id),
                ]);
                const vestes = (vRes?.data || (Array.isArray(vRes) ? vRes : [])).slice(0, 4);
                const pantalons = (pRes?.data || (Array.isArray(pRes) ? pRes : [])).slice(0, 4);
                const gilets = (gRes?.data || (Array.isArray(gRes) ? gRes : [])).slice(0, 4);

                const pairsCount = Math.min(vestes.length, pantalons.length, 4);
                if (pairsCount > 0) {
                    const defaults = [
                        'Costume Business',
                        'Costume Casual',
                        'Costume Slim',
                        'Costume Cérémonie',
                    ];
                    for (let i = 0; i < pairsCount; i++) {
                        const payload = costumeService.validateCostumeData({
                            name: defaults[i],
                            userId: user.id,
                            vesteProfileId: vestes[i]?.id,
                            giletId: gilets[i]?.id || null,
                            pantalonId: pantalons[i]?.id,
                        });
                        await costumeService.createCostume(payload);
                    }
                    const afterSeed = await costumeService.getCostumesByUser(user.id);
                    costumesArray = afterSeed?.data || (Array.isArray(afterSeed) ? afterSeed : []);
                }
            }

            setCostumes(costumesArray);

        } catch (err) {
            console.error('Error fetching costumes:', err);
            const message = err?.message || 'Impossible de charger vos costumes';
            setError(message);
            setCostumes([]); // Évite les erreurs de rendu .map
            Alert.alert('Erreur', message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => fetchCostumes();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            {/* HEADER */}
            <View style={styles.header}>
                <Themedtext style={styles.headerTitle}>Mes Costumes</Themedtext>
                <TouchableOpacity onPress={handleRefresh} disabled={loading}>
                    <Ionicons
                        name="refresh"
                        size={24}
                        color={loading ? "#cccccc" : "#1e3a8a"}
                    />
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#1e3a8a" />
                        <Spacer height={12} />
                        <Text style={styles.loadingText}>Chargement de vos ensembles...</Text>
                    </View>

                ) : error ? (
                    <View style={styles.centerContent}>
                        <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
                        <Spacer height={16} />
                        <Text style={styles.errorText}>Erreur de chargement</Text>
                        <Spacer height={8} />
                        <Text style={styles.errorSubtext}>{error}</Text>
                        <Spacer height={20} />
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRefresh}
                        >
                            <Text style={styles.retryButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>

                ) : costumes.length === 0 ? (
                    <View style={styles.centerContent}>
                        <MaterialCommunityIcons name="tshirt-crew-outline" size={64} color="#cccccc" />
                        <Spacer height={16} />
                        <Themedtext style={styles.emptyText}>Aucun Costume</Themedtext>
                        <Spacer height={8} />
                        <Text style={styles.emptySubtext}>
                            Vous n'avez pas encore composé de costume personnalisé.
                        </Text>
                    </View>

                ) : (
                    costumes.map((costume) => (
                        <TouchableOpacity
                            key={costume.id}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() =>
                                router.push({
                                    pathname: `/MainApplication/Profiles/CostumeDetails`,
                                    params: { id: costume.id }
                                })
                            }
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="black-mesa" size={28} color="#1e3a8a" />
                                </View>

                                <View style={styles.info}>
                                    <Text style={styles.name}>
                                        {costume.name || 'Costume Sans Nom'}
                                    </Text>
                                    <Text style={styles.description} numberOfLines={2}>
                                        {costume.veste_profile_id ? "✓ Veste " : ""}
                                        {costume.pantalon_id ? "✓ Pantalon " : ""}
                                        {costume.gilet_id ? "✓ Gilet" : ""}
                                    </Text>
                                </View>

                                <Ionicons name="chevron-forward" size={20} color="#999999" />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* CREATE BUTTON */}
            <TouchableOpacity
                style={styles.pillButton}
                activeOpacity={0.8}
                onPress={() => router.push('/MainApplication/Profiles/Create/CreateCostume')}
            >
                <View style={styles.plusIconContainer}>
                    <Ionicons name="add" size={24} color="#ffffff" />
                </View>
                <Text style={styles.pillText}>Composer un Costume</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: "#1e293b" },
    scrollContent: { padding: 16, paddingBottom: 120 },
    centerContent: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
    loadingText: { marginTop: 8, color: "#555" },
    errorText: { fontSize: 18, fontWeight: "bold", color: "#ff6b6b", textAlign: "center" },
    errorSubtext: { textAlign: "center", color: "#777" },
    retryButton: { backgroundColor: "#1e3a8a", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
    retryButtonText: { color: "#ffffff", fontWeight: "bold" },
    emptyText: { fontSize: 18, fontWeight: "600" },
    emptySubtext: { textAlign: "center", color: "#777", marginHorizontal: 20 },
    card: { backgroundColor: "#f8fafc", borderRadius: 15, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0", elevation: 2 },
    cardHeader: { flexDirection: "row", alignItems: "center" },
    iconContainer: { marginRight: 15, backgroundColor: "#f1f5f9", padding: 10, borderRadius: 12 },
    info: { flex: 1 },
    name: { fontSize: 17, fontWeight: "bold", color: "#1e293b" },
    description: { fontSize: 13, color: "#64748b", marginTop: 4, fontStyle: 'italic' },
    pillButton: { position: "absolute", bottom: 30, right: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#1e3a8a", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 30, elevation: 8 },
    plusIconContainer: { marginRight: 8 },
    pillText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});

export default CostumeProfile;