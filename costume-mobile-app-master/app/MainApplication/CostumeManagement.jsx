import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import costumeService from '../../Services/CostumeService';
import vesteService from '../../Services/VesteService';
import pantalonService from '../../Services/PantalonService';
import giletService from '../../Services/GiletService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CostumeManagement = () => {
    const [costumes, setCostumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCostume, setSelectedCostume] = useState(null);

    const [vesteList, setVesteList] = useState([]);
    const [pantalonList, setPantalonList] = useState([]);
    const [giletList, setGiletList] = useState([]);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [resCostumes, resVestes, resPantalons, resGilets] = await Promise.all([
                costumeService.getAllCostumes(),
                vesteService.getAllProfiles(),
                pantalonService.getAllProfiles(),
                giletService.getAllProfiles()
            ]);

            const formattedCostumes = (Array.isArray(resCostumes) ? resCostumes : resCostumes.data || [])
                .map(item => costumeService.formatCostumeForDisplay(item));

            setCostumes(formattedCostumes);
            setVesteList(Array.isArray(resVestes) ? resVestes : resVestes.data || []);
            setPantalonList(Array.isArray(resPantalons) ? resPantalons : resPantalons.data || []);
            setGiletList(Array.isArray(resGilets) ? resGilets : resGilets.data || []);
        } catch (error) {
            console.error("Erreur:", error);
            Alert.alert("Erreur", "Impossible de charger les données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAllData(); }, []);

    const handleUpdate = async () => {
        try {
            const dataToSend = {
                name: selectedCostume.name,
                user_id: selectedCostume.userId,
                veste_profile_id: selectedCostume.vesteProfileId,
                pantalon_id: selectedCostume.pantalonId,
                gilet_id: selectedCostume.giletId
            };
            await costumeService.updateCostume(selectedCostume.id, dataToSend);
            setModalVisible(false);
            loadAllData();
            Alert.alert("Succès", "Tenue mise à jour");
        } catch (e) {
            Alert.alert("Erreur", "Échec de la mise à jour");
        }
    };

    const SelectorSection = ({ title, data, selectedId, onSelect, icon }) => (
        <View style={styles.section}>
            <Text style={styles.label}><MaterialCommunityIcons name={icon} size={14}/> {title}</Text>
            <View style={styles.chipGroup}>
                {data.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.chip, selectedId === item.id && styles.chipSelected]}
                        onPress={() => onSelect(item.id)}
                    >
                        <Text style={[styles.chipText, selectedId === item.id && styles.chipTextSelected]}>
                            {item.profile_name || item.profileName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="tie" size={24} color="#1e3a8a" />
                <Text style={styles.costumeName}>{item.name}</Text>
            </View>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Veste: {item.veste?.profile_name || 'N/A'}</Text>
                <Text style={styles.summaryText}>Pantalon: {item.pantalon?.profile_name || 'N/A'}</Text>
                {item.gilet && <Text style={styles.summaryText}>Gilet: {item.gilet?.profile_name}</Text>}
            </View>
            <TouchableOpacity style={styles.mainEditBtn} onPress={() => { setSelectedCostume(item); setModalVisible(true); }}>
                <Text style={styles.mainEditBtnText}>Modifier la configuration</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#1e3a8a" style={{flex:1}} />;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Mes Tenues</Text>
            <FlatList data={costumes} keyExtractor={c => c.id.toString()} renderItem={renderItem} />

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>Modifier le Costume</Text>

                        <Text style={styles.label}>Nom du costume</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedCostume?.name}
                            onChangeText={t => setSelectedCostume({...selectedCostume, name: t})}
                        />

                        <SelectorSection
                            title="Choisir la Veste"
                            icon="tshirt-crew"
                            data={vesteList}
                            selectedId={selectedCostume?.vesteProfileId}
                            onSelect={id => setSelectedCostume({...selectedCostume, vesteProfileId: id})}
                        />

                        <SelectorSection
                            title="Choisir le Pantalon"
                            icon="human-male"
                            data={pantalonList}
                            selectedId={selectedCostume?.pantalonId}
                            onSelect={id => setSelectedCostume({...selectedCostume, pantalonId: id})}
                        />

                        <View style={styles.modalFooter}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn}>
                                <Text style={styles.saveBtnText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
    card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    costumeName: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#1e3a8a' },
    summary: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, marginBottom: 15 },
    summaryText: { fontSize: 14, color: '#475569', marginBottom: 3 },
    mainEditBtn: { backgroundColor: '#1e3a8a', padding: 12, borderRadius: 10, alignItems: 'center' },
    mainEditBtnText: { color: '#fff', fontWeight: 'bold' },
    modalContent: { flex: 1, padding: 25, paddingTop: 50 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#64748b', marginTop: 20, marginBottom: 10 },
    input: { borderBottomWidth: 1, borderColor: '#cbd5e1', padding: 8, fontSize: 16 },
    chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#cbd5e1' },
    chipSelected: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
    chipText: { fontSize: 13, color: '#475569' },
    chipTextSelected: { color: '#fff', fontWeight: 'bold' },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 40, gap: 20, paddingBottom: 40 },
    cancelBtn: { padding: 10 },
    saveBtn: { backgroundColor: '#1e3a8a', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
    saveBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default CostumeManagement;