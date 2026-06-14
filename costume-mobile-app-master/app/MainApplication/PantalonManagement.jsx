import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import PantalonService from '../../Services/PantalonService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PantalonManagement = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            const response = await PantalonService.getAllProfiles();

            let rawData = [];
            // Gestion du format de réponse (Tableau direct ou enveloppé dans .data)
            if (response && response.success) {
                rawData = response.data;
            } else if (Array.isArray(response)) {
                rawData = response;
            }

            const formattedData = rawData.map(item => PantalonService.formatProfileForDisplay(item));
            setProfiles(formattedData);
        } catch (error) {
            console.error("Erreur LoadProfiles Pantalon:", error);
            Alert.alert("Erreur", "Impossible de charger les mesures pantalons");
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
            "Supprimer ces mesures de pantalon ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await PantalonService.deleteProfile(id);
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
            const dataToSave = PantalonService.validateProfileData(selectedProfile);
            await PantalonService.updateProfile(selectedProfile.id, dataToSave);

            setModalVisible(false);
            loadProfiles();
            Alert.alert("Succès", "Mesures pantalon mises à jour");
        } catch (e) {
            Alert.alert("Erreur", "Échec de la mise à jour");
        }
    };

    const renderPantalonItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.profileName}>{item.profile_name}</Text>
                <Text style={styles.measureSummary}>
                    Taille: {item.tour_taille}cm | Entrejambes: {item.longueur_entrejambes}cm
                </Text>
                <View style={styles.detailsBadge}>
                    <Text style={styles.detailsText}>Coupe {item.coupe} • Revers: {item.revers}</Text>
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
            <Text style={styles.headerTitle}>Mesures Pantalons ({profiles.length})</Text>

            <FlatList
                data={profiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPantalonItem}
                contentContainerStyle={styles.list}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier le Pantalon</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <Text style={styles.label}>Nom du profil</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedProfile?.profile_name}
                                onChangeText={(text) => setSelectedProfile({...selectedProfile, profile_name: text})}
                            />

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Tour Taille</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.tour_taille}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, tour_taille: text})}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Tour Hanches</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.tour_hanches}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, tour_hanches: text})}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Tour Cuisse</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.tour_cuisse}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, tour_cuisse: text})}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Long. Entrejambes</Text>
                                    <TextInput style={styles.input} keyboardType="numeric"
                                               value={selectedProfile?.longueur_entrejambes}
                                               onChangeText={(text) => setSelectedProfile({...selectedProfile, longueur_entrejambes: text})}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Coupe (slim, regular, loose)</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedProfile?.coupe}
                                onChangeText={(text) => setSelectedProfile({...selectedProfile, coupe: text})}
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
    detailsBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
    detailsText: { fontSize: 11, color: '#166534', fontWeight: 'bold' },
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

export default PantalonManagement;