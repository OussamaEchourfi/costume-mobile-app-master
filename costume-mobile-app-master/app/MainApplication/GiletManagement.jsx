import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import giletService from '../../Services/GiletService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GiletManagement = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            const response = await giletService.getAllProfiles();

            let rawData = [];
            // Gestion de la réponse (Tableau direct de Laravel ou enveloppe {success, data})
            if (response && response.success) {
                rawData = response.data;
            } else if (Array.isArray(response)) {
                rawData = response;
            }

            const formattedData = rawData.map(item => giletService.formatProfileForDisplay(item));
            setProfiles(formattedData);
        } catch (error) {
            console.error("Erreur LoadProfiles Gilet:", error);
            Alert.alert("Erreur", "Impossible de charger les mesures gilets");
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
            "Supprimer ce profil de gilet ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await giletService.deleteProfile(id);
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
            const dataToSave = giletService.validateProfileData(selectedProfile);
            await giletService.updateProfile(selectedProfile.id, dataToSave);

            setModalVisible(false);
            loadProfiles();
            Alert.alert("Succès", "Mesures gilet mises à jour");
        } catch (e) {
            Alert.alert("Erreur", "Échec de la mise à jour");
        }
    };

    const renderGiletItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.profileName}>{item.profileName}</Text>
                <Text style={styles.measureSummary}>
                    Poitrine: {item.tourPoitrine}cm | Longueur: {item.longueurGilet}cm
                </Text>
                <View style={styles.detailsBadge}>
                    <Text style={styles.detailsText}>{item.boutons} boutons • Poches: {item.poches}</Text>
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
            <Text style={styles.headerTitle}>Mesures Gilets ({profiles.length})</Text>

            <FlatList
                data={profiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGiletItem}
                contentContainerStyle={styles.list}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier le Gilet</Text>
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
                                    <Text style={styles.label}>Épaules</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.largeurEpaules}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, largeurEpaules: text})}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Long. Gilet</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.longueurGilet}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, longueurGilet: text})}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Nombre de boutons (5, 6 ou 7)</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={selectedProfile?.boutons?.toString()}
                                onChangeText={(text) => setSelectedProfile({...selectedProfile, boutons: text})}
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
    detailsBadge: { backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
    detailsText: { fontSize: 11, color: '#9a3412', fontWeight: 'bold' },
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

export default GiletManagement;