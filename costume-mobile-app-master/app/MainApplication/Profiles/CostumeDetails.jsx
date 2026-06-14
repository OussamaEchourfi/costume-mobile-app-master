import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import costumeService from '../../../Services/CostumeService';
import authService from '../../../Services/authService';

const CostumeDetails = () => {
    const { id } = useLocalSearchParams();
    const [costume, setCostume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCostumeDetails();
        }
    }, [id]);

    const fetchCostumeDetails = async () => {
        try {
            setLoading(true);

            // 1. Récupérer l'ID de l'utilisateur connecté
            const currentUserId = await authService.getCurrentUserId();

            if (!currentUserId) {
                Alert.alert("Session expirée", "Veuillez vous reconnecter.");
                router.replace('/login');
                return;
            }

            // 2. Appel au service pour récupérer les données
            const response = await costumeService.getCostumeById(id);

            // 3. EXTRACTION SÉCURISÉE (Basée sur votre log : response.costume)
            const costumeData = response?.costume ? response.costume : response;

            if (costumeData) {
                // 4. RÉCUPÉRATION DE L'ID PROPRIÉTAIRE
                const ownerId = costumeData.user_id;

                // 5. COMPARAISON STRICTE (Conversion en Number pour éviter les erreurs de type)
                if (ownerId && Number(ownerId) === Number(currentUserId)) {
                    // Formatage pour l'affichage (mappage des clés)
                    const formatted = costumeService.formatCostumeForDisplay(costumeData);
                    setCostume(formatted);
                } else {
                    console.log("Accès refusé. IDs :", { Me: currentUserId, Owner: ownerId });
                    Alert.alert("Accès refusé", "Ce costume ne vous appartient pas.");
                    router.back();
                }
            } else {
                Alert.alert("Erreur", "Données du costume introuvables.");
                router.back();
            }
        } catch (error) {
            console.error('Erreur technique CostumeDetails:', error);
            Alert.alert("Erreur", "Problème de communication avec le serveur.");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmer',
            "Supprimer cet ensemble ?",
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await costumeService.deleteCostume(costume.id);
                            Alert.alert('Supprimé', 'Costume supprimé avec succès');
                            router.back();
                        } catch (e) {
                            Alert.alert('Erreur', 'Suppression impossible');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#335333" />
                <Text style={styles.loadingText}>Chargement de l'ensemble...</Text>
            </View>
        );
    }

    if (!costume) return null;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Détails du Costume</Text>
                <View style={styles.actionsRight}>
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/MainApplication/Profiles/Create/CreateCostume',
                            params: { id: costume.id }
                        })}
                        style={styles.editIconButton}
                    >
                        <MaterialCommunityIcons name="pencil-outline" size={24} color="#335333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={[styles.editIconButton, styles.iconButtonMargin]}>
                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#e11d48" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profil Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <MaterialCommunityIcons name="suit-tie" size={45} color="#fff" />
                    </View>
                    <Text style={styles.profileName}>{costume.name}</Text>
                    <Text style={styles.lastUpdate}>Ensemble personnalisé</Text>
                </View>

                {/* Section Composants */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Composants de l'ensemble</Text>

                    <ComponentLink
                        label="Veste"
                        targetId={costume.vesteProfileId}
                        icon="jacket"
                        route="/MainApplication/Profiles/VesteDetails"
                        status={costume.vesteProfileId ? "Profil sélectionné" : "Non définie"}
                    />

                    <ComponentLink
                        label="Pantalon"
                        targetId={costume.pantalonId}
                        icon="fencing"
                        route="/MainApplication/Profiles/PantalonDetails"
                        status={costume.pantalonId ? "Profil sélectionné" : "Non défini"}
                    />

                    <ComponentLink
                        label="Gilet"
                        targetId={costume.giletId}
                        icon="tshirt-v"
                        route="/MainApplication/Profiles/GiletDetails"
                        status={costume.giletId ? "Profil sélectionné" : "Optionnel"}
                    />
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Informations</Text>
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="calendar-check" size={20} color="#64748b" />
                        <Text style={styles.infoText}>Dernière modification : {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// Sous-composant pour les lignes de composants
const ComponentLink = ({ label, targetId, icon, route, status }) => (
    <TouchableOpacity
        style={[styles.componentRow, !targetId && styles.disabledRow]}
        onPress={() => targetId && router.push({ pathname: route, params: { id: targetId } })}
        disabled={!targetId}
    >
        <View style={styles.rowLeft}>
            <View style={[styles.iconBox, { backgroundColor: targetId ? '#335333' : '#cbd5e1' }]}>
                <MaterialCommunityIcons name={icon} size={20} color="#fff" />
            </View>
            <View>
                <Text style={styles.componentLabel}>{label}</Text>
                <Text style={styles.componentStatus}>{status}</Text>
            </View>
        </View>
        {targetId && <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#64748b' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    actionsRight: { flexDirection: 'row', alignItems: 'center' },
    iconButtonMargin: { marginLeft: 12 },
    scrollContent: { paddingBottom: 30 },
    profileHeader: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        elevation: 2,
    },
    avatarContainer: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#1e293b', justifyContent: 'center',
        alignItems: 'center', marginBottom: 15
    },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
    lastUpdate: { fontSize: 14, color: '#64748b', marginTop: 5 },
    sectionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        elevation: 1,
    },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
    componentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc'
    },
    disabledRow: { opacity: 0.5 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    componentLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    componentStatus: { fontSize: 12, color: '#64748b' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    infoText: { marginLeft: 10, fontSize: 14, color: '#475569' }
});

export default CostumeDetails;