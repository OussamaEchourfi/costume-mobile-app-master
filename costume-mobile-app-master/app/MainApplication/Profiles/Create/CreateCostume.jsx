import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import costumeService from '../../../../Services/CostumeService';
import vesteService from '../../../../Services/VesteService';
import giletService from '../../../../Services/GiletService';
import pantalonService from '../../../../Services/PantalonService';
import authService from '../../../../Services/authService';

const CreateCostume = () => {

    const [costumeName, setCostumeName] = useState('');
    const [selectedVeste, setSelectedVeste] = useState(null);
    const [selectedGilet, setSelectedGilet] = useState(null);
    const [selectedPantalon, setSelectedPantalon] = useState(null);


    const [data, setData] = useState({ vestes: [], gilets: [], pantalons: [] });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadAllProfiles();
    }, []);

    const loadAllProfiles = async () => {
        try {
            setLoading(true);
            const userId = await authService.getCurrentUserId();

            // Appel simultané des 3 services
            const [vRes, gRes, pRes] = await Promise.all([
                vesteService.getProfilesByUser(userId),
                giletService.getProfilesByUser(userId),
                pantalonService.getProfilesByUser(userId)
            ]);

            /**
             * CORRECTION : Extraction du champ .data car votre Laravel
             * renvoie { success: true, data: [...], message: "..." }
             */
            setData({
                vestes: vRes?.data || (Array.isArray(vRes) ? vRes : []),
                gilets: gRes?.data || (Array.isArray(gRes) ? gRes : []),
                pantalons: pRes?.data || (Array.isArray(pRes) ? pRes : [])
            });

        } catch (error) {
            console.error('Erreur chargement profils:', error);
            Alert.alert("Erreur", "Impossible de charger vos profils de mesures.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!costumeName.trim()) {
            Alert.alert("Champ requis", "Veuillez donner un nom à ce costume.");
            return;
        }
        if (!selectedVeste && !selectedPantalon) {
            Alert.alert("Sélection requise", "Un costume doit au moins comporter une veste ou un pantalon.");
            return;
        }

        try {
            setSubmitting(true);
            const userId = await authService.getCurrentUserId();

            const payload = costumeService.validateCostumeData({
                name: costumeName,
                userId: userId,
                vesteProfileId: selectedVeste?.id,
                giletId: selectedGilet?.id,
                pantalonId: selectedPantalon?.id
            });

            await costumeService.createCostume(payload);
            Alert.alert("Succès", "Votre costume a été créé !", [
                { text: "OK", onPress: () => router.push('/MainApplication/MyProfiles') }
            ]);
        } catch (error) {
            console.error('Erreur création costume:', error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la création.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1e3a8a" />
                <Spacer height={10} />
                <Text>Chargement de vos profils...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Composer un Costume</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* NOM DU COSTUME */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nom du costume</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ex: Mariage Juillet, Business Bleu..."
                        value={costumeName}
                        onChangeText={setCostumeName}
                    />
                </View>

                {/* SÉLECTION VESTE */}
                <SelectorSection
                    title="Choisir une Veste"
                    icon="suit-club"
                    items={data.vestes}
                    selectedItem={selectedVeste}
                    onSelect={setSelectedVeste}
                    emptyMessage="Aucun profil de veste trouvé"
                />

                {/* SÉLECTION PANTALON */}
                <SelectorSection
                    title="Choisir un Pantalon"
                    icon="fencing"
                    items={data.pantalons}
                    selectedItem={selectedPantalon}
                    onSelect={setSelectedPantalon}
                    emptyMessage="Aucun profil de pantalon trouvé"
                />

                {/* SÉLECTION GILET */}
                <SelectorSection
                    title="Choisir un Gilet (Optionnel)"
                    icon="vest"
                    items={data.gilets}
                    selectedItem={selectedGilet}
                    onSelect={setSelectedGilet}
                    emptyMessage="Aucun profil de gilet trouvé"
                />

                {/* BOUTON DE VALIDATION */}
                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.disabledButton]}
                    onPress={handleCreate}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Enregistrer le Costume</Text>
                    )}
                </TouchableOpacity>

                <Spacer height={40} />
            </ScrollView>
        </SafeAreaView>
    );
};

/**
 * COMPOSANT DE SÉLECTION (INTERNE)
 * Corrigé avec items=[] par défaut pour éviter items.map error
 */
const SelectorSection = ({ title, icon, items = [], selectedItem, onSelect, emptyMessage }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={icon} size={22} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {!items || items.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {items.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.itemCard, isSelected && styles.selectedCard]}
                            onPress={() => onSelect(isSelected ? null : item)}
                        >
                            <View style={styles.cardContent}>
                                <Text style={[styles.itemName, isSelected && styles.selectedText]}>
                                    {item.profile_name || 'Sans nom'}
                                </Text>
                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        )}
    </View>
);

const Spacer = ({ height }) => <View style={{ height }} />;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
    scrollContent: { padding: 20 },
    section: { marginBottom: 25 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { marginLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    horizontalList: { flexDirection: 'row', paddingVertical: 5 },
    emptyContainer: { padding: 10, backgroundColor: '#f8fafc', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
    itemCard: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 12,
        marginRight: 12,
        minWidth: 150,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 1,
    },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    selectedCard: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
    itemName: { color: '#334155', fontWeight: '600', fontSize: 14 },
    selectedText: { color: '#fff' },
    emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: 13, textAlign: 'center' },
    submitButton: { backgroundColor: '#1e3a8a', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 3 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    disabledButton: { opacity: 0.6 }
});

export default CreateCostume;