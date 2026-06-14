import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import de vos services
import giletService from '../../../Services/GiletService';
import authService from '../../../Services/authService';

const GiletDetails = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);

            const userId = await authService.getCurrentUserId();

            if (!userId) {
                Alert.alert("Erreur", "Utilisateur non identifié");
                router.replace('/login');
                return;
            }

            const response = await giletService.getProfilesByUser(userId);

            if (response && response.length > 0) {
                const formattedData = giletService.formatProfileForDisplay(response[0]);
                setProfile(formattedData);
            } else {
                setProfile(null); // Aucun profil trouvé
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Impossible de charger vos mesures.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmer',
            'Supprimer ce profil de gilet ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await giletService.deleteProfile(profile.id);
                            Alert.alert('Supprimé', 'Profil supprimé avec succès');
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
                <ActivityIndicator size="large" color="#e74c3c" />
                <Text style={styles.loadingText}>Chargement de vos mesures...</Text>
            </View>
        );
    }


    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="tape-measure" size={80} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>Aucun profil trouvé</Text>
                    <Text style={styles.emptyDesc}>Vous n'avez pas encore enregistré vos mesures de gilet.</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.push('/MainApplication/Profiles/Create/CreateGilet')}
                    >
                        <Text style={styles.createButtonText}>Créer mon profil maintenant</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mesures Gilet</Text>
                <View style={styles.actionsRight}>
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/MainApplication/Profiles/Create/CreateGilet', params: { id: profile.id } })}
                        style={styles.editIconButton}
                    >
                        <MaterialCommunityIcons name="pencil-outline" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={[styles.editIconButton, styles.iconButtonMargin]}>
                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#e11d48" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <MaterialCommunityIcons name="tshirt-v" size={40} color="#fff" />
                    </View>
                    <Text style={styles.profileName}>{profile.profileName}</Text>
                    <Text style={styles.lastUpdate}>Profil vérifié</Text>
                </View>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Dimensions (cm)</Text>
                    <View style={styles.measureGrid}>
                        <MeasureCard label="Poitrine" value={profile.tourPoitrine} icon="ruler" />
                        <MeasureCard label="Taille" value={profile.tourTaille} icon="tape-measure" />
                        <MeasureCard label="Longueur" value={profile.longueurGilet} icon="arrow-up-down" />
                        <MeasureCard label="Épaules" value={profile.largeur_epaules} icon="arrow-left-right" />
                    </View>
                </View>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Préférences de style</Text>

                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="dots-vertical" size={20} color="#64748b" />
                        <Text style={styles.detailLabel}>Nombre de boutons :</Text>
                        <Text style={styles.detailValue}>{profile.boutons}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="pocket" size={20} color="#64748b" />
                        <Text style={styles.detailLabel}>Type de poches :</Text>
                        <Text style={styles.detailValue}>{profile.poches}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// Composant interne pour les petites cartes de mesures
const MeasureCard = ({ label, value, icon }) => (
    <View style={styles.mCard}>
        <MaterialCommunityIcons name={icon} size={18} color="#e74c3c" style={styles.mIcon} />
        <Text style={styles.mValue}>{value || '--'}</Text>
        <Text style={styles.mLabel}>{label}</Text>
    </View>
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
        backgroundColor: '#e74c3c', justifyContent: 'center',
        alignItems: 'center', marginBottom: 15
    },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
    lastUpdate: { fontSize: 13, color: '#94a3b8', marginTop: 5 },
    sectionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        elevation: 1,
    },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#64748b', marginBottom: 15, textTransform: 'uppercase' },
    measureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    mCard: {
        width: '48%', backgroundColor: '#f1f5f9',
        borderRadius: 15, padding: 15, marginBottom: 12, alignItems: 'center'
    },
    mValue: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    mLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
    mIcon: { marginBottom: 5 },
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    detailLabel: { flex: 1, marginLeft: 10, fontSize: 15, color: '#475569' },
    detailValue: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', textTransform: 'capitalize' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginTop: 20 },
    emptyDesc: { textAlign: 'center', color: '#64748b', marginTop: 10, marginBottom: 30 },
    createButton: { backgroundColor: '#1e293b', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12 },
    createButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default GiletDetails;