import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import vesteService from '../../Services/VesteService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VesteManagement = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            const response = await vesteService.getAllProfiles();

            console.log("Response Veste reçue:", response);

            let rawData = [];

            // Correction ici : Suppression du mot 'direct' qui causait l'erreur
            if (response && response.success) {
                rawData = response.data;
            } else if (Array.isArray(response)) {
                rawData = response;
            }

            // Sécurité : on s'assure que rawData est bien un tableau avant le .map
            if (Array.isArray(rawData)) {
                const formattedData = rawData.map(item => vesteService.formatProfileForDisplay(item));
                setProfiles(formattedData);
            } else {
                setProfiles([]);
            }

        } catch (error) {
            console.error("Erreur LoadProfiles détaillée:", error);
            Alert.alert("Erreur", "Impossible de charger les profils");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfiles();
    }, []);

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmation",
            "Supprimer ce profil de mesures ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await vesteService.deleteProfile(id);
                            setProfiles(profiles.filter(p => p.id !== id));
                            Alert.alert("Succès", "Profil supprimé");
                        } catch (e) {
                            Alert.alert("Erreur", "Échec de la suppression");
                        }
                    }
                }
            ]
        );
    };

    const openEditModal = (profile) => {
        setSelectedProfile({ ...profile });
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            // On re-transforme en snake_case pour le backend avant l'envoi
            const dataToLink = vesteService.validateProfileData(selectedProfile);
            await vesteService.updateProfile(selectedProfile.id, dataToLink);

            setModalVisible(false);
            loadProfiles();
            Alert.alert("Succès", "Mesures mises à jour");
        } catch (e) {
            Alert.alert("Erreur", "Échec de la mise à jour technique");
        }
    };

    const renderVesteItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.profileName}>{item.profileName}</Text>
                <Text style={styles.measureSummary}>
                    Poitrine: {item.tourPoitrine}cm | Épaules: {item.largeurEpaules}cm
                </Text>
                <View style={styles.detailsBadge}>
                    <Text style={styles.detailsText}>{item.typeRevers} • {item.boutons} boutons</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <MaterialCommunityIcons name="trash-can" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#1e3a8a" style={styles.centered} />;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Mesures Vestes ({profiles.length})</Text>

            <FlatList
                data={profiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderVesteItem}
                contentContainerStyle={styles.list}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier les Mesures</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <Text style={styles.label}>Nom du profil</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedProfile?.profileName}
                                onChangeText={(text) => setSelectedProfile({...selectedProfile, profileName: text})}
                            />

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Tour Poitrine</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.tourPoitrine}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, tourPoitrine: text})}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Tour Taille</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.tourTaille}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, tourTaille: text})}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Largeur Épaules</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.largeurEpaules}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, largeurEpaules: text})}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Long. Manche</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.longueurManche}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, longueurManche: text})}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Type de Revers</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedProfile?.typeRevers}
                                onChangeText={(text) => setSelectedProfile({...selectedProfile, typeRevers: text})}
                            />

                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn}>
                                <Text style={styles.saveBtnText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 15 },
    centered: { flex: 1, justifyContent: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#1e293b' },
    list: { paddingBottom: 20 },
    card: {
        backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.1
    },
    profileName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    measureSummary: { fontSize: 13, color: '#64748b', marginVertical: 4 },
    detailsBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
    detailsText: { fontSize: 11, color: '#475569', fontWeight: 'bold' },
    actions: { flexDirection: 'row', gap: 8 },
    editBtn: { padding: 8, backgroundColor: '#eff6ff', borderRadius: 8 },
    deleteBtn: { padding: 8, backgroundColor: '#fef2f2', borderRadius: 8 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '85%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    label: { fontSize: 13, color: '#64748b', marginBottom: 5, marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, color: '#1e293b' },
    row: { flexDirection: 'row', gap: 10 },
    flex1: { flex: 1 },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
    cancelBtn: { padding: 12 },
    saveBtn: { backgroundColor: '#1e3a8a', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
    saveBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default VesteManagement;