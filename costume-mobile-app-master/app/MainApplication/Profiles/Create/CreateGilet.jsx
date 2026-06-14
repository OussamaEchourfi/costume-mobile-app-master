import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import GiletService from "../../../../Services/GiletService";
import { router } from "expo-router";
import authService from "../../../../Services/authService";

export default function GiletProfileForm() {
    const [profile, setProfile] = useState({
        user_id: 0,
        profile_name: 'Profil Gilet',
        tour_poitrine: '',
        tour_taille: '',
        largeur_epaules: '',
        longueur_gilet: '',
        boutons: '5',
        poches: 'classique'
    });

    useEffect(() => {
        const getCurrentUserId = async () => {
            const userId = await authService.getCurrentUserId();
            setProfile(prev => ({ ...prev, user_id: userId }));
        }
        getCurrentUserId();
    }, []);

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const validatedData = GiletService.validateProfileData(profile);
            const result = await GiletService.createProfile(validatedData);
            Alert.alert("Succès", "Profil de gilet enregistré !");
            router.back();
        } catch (error) {
            Alert.alert("Erreur", error.message || "Impossible de créer le profil");
        }
    };

    const handleReset = () => {
        setProfile({
            profileName: 'Profil Gilet',
            tourPoitrine: '',
            tourTaille: '',
            largeurEpaules: '',
            longueurGilet: '',
            typeBoutons: '5',
            poches: 'classique'
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profil de Gilet</Text>
                <Text style={styles.headerSubtitle}>Renseignez vos mesures</Text>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.label}>Nom du Profil</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.profileName}
                        onChangeText={(v) => handleInputChange('profileName', v)}
                        placeholder="Nom du profil"
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mesures (cm)</Text>

                    <Text style={styles.label}>Tour de Poitrine</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tourPoitrine}
                        onChangeText={(v) => handleInputChange('tourPoitrine', v)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 98"
                    />

                    <Text style={styles.label}>Tour de Taille</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tourTaille}
                        onChangeText={(v) => handleInputChange('tourTaille', v)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 85"
                    />

                    <Text style={styles.label}>Largeur d'Épaules</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.largeurEpaules}
                        onChangeText={(v) => handleInputChange('largeurEpaules', v)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 45"
                    />

                    <Text style={styles.label}>Longueur du Gilet</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.longueurGilet}
                        onChangeText={(v) => handleInputChange('longueurGilet', v)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 60"
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Style</Text>
                    <Text style={styles.label}>Nombre de Boutons</Text>
                    <View style={styles.buttonGroup}>
                        {[4, 5, 6].map(b => (
                            <TouchableOpacity
                                key={b}
                                style={[
                                    styles.optionButton,
                                    profile.typeBoutons === b && styles.optionButtonActive
                                ]}
                                onPress={() => handleInputChange('typeBoutons', b)}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    profile.typeBoutons === b && styles.optionButtonTextActive
                                ]}>
                                    {b} Boutons
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.label}>Type de Poches</Text>
                    <View style={styles.buttonGroup}>
                        {['classique', 'passepoil', 'double'].map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.optionButton,
                                    profile.poches === p && styles.optionButtonActive
                                ]}
                                onPress={() => handleInputChange('poches', p)}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    profile.poches === p && styles.optionButtonTextActive
                                ]}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Boutons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Enregistrer le Profil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text style={styles.resetButtonText}>Réinitialiser</Text>
                    </TouchableOpacity>
                </View>

                {/* Debug */}
                <View style={styles.debugContainer}>
                    <Text style={styles.debugTitle}>Valeurs actuelles :</Text>
                    <Text style={styles.debugText}>{JSON.stringify(profile, null, 2)}</Text>
                </View>

            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#1e293b',
        padding: 20,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#cbd5e1',
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginTop: 12,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1e293b',
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    optionButton: {
        flex: 1,
        minWidth: 90,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    optionButtonActive: {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
    },
    optionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    optionButtonTextActive: {
        color: '#ffffff',
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#cbd5e1',
    },
    resetButtonText: {
        color: '#475569',
        fontSize: 16,
        fontWeight: 'bold',
    },
    debugContainer: {
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: '#475569',
        fontFamily: 'monospace',
    },
});
