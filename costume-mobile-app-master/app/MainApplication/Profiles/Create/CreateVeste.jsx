import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet, Alert,
} from 'react-native';
import VesteService from "../../../../Services/VesteService";
import {router} from "expo-router";
import authService from "../../../../Services/authService";

export default function VesteProfileForm() {
    const [profile, setProfile] = useState({
        user_id : 0,
        profileName: 'Profil Principal',
        tourPoitrine: '',
        tourTaille: '',
        tourHanches: '',
        largeurEpaules: '',
        longueurManche: '',
        longueurVeste: '',
        typeRevers: 'notch',
        boutons: '2',
        poches: 'flap',
        ventriere: 'cote'
    });

    useEffect(()=>{
     const getCurrentUserId = async () => {
        const userId = await authService.getCurrentUserId();
        setProfile(prev => ({...prev,user_id: userId}))
     }
     getCurrentUserId();
    },[])

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const validatedData = VesteService.validateProfileData(profile);
            const result = await VesteService.createProfile(validatedData);
            Alert.alert('Succès', 'Profil enregistré avec succès!');
            router.back();
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Impossible de créer le profil');
        }
    };

    const handleReset = () => {
        setProfile({
            profileName: 'Profil Principal',
            tourPoitrine: '',
            tourTaille: '',
            tourHanches: '',
            largeurEpaules: '',
            longueurManche: '',
            longueurVeste: '',
            typeRevers: 'notch',
            boutons: '2',
            poches: 'flap',
            ventriere: 'cote'
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profil de Veste</Text>
                <Text style={styles.headerSubtitle}>Configurez vos mesures et préférences</Text>
            </View>

            {/* Scrollable Form */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Nom du profil */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nom du Profil</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.profileName}
                        onChangeText={(value) => handleInputChange('profileName', value)}
                        maxLength={100}
                        placeholder="Nom du profil"
                    />
                </View>

                {/* Mesures Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mesures (cm)</Text>

                    <Text style={styles.label}>Tour de Poitrine</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tourPoitrine}
                        onChangeText={(value) => handleInputChange('tourPoitrine', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 98.50"
                    />

                    <Text style={styles.label}>Tour de Taille</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tourTaille}
                        onChangeText={(value) => handleInputChange('tourTaille', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 85.00"
                    />

                    <Text style={styles.label}>Tour de Hanches</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tourHanches}
                        onChangeText={(value) => handleInputChange('tourHanches', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 95.00"
                    />

                    <Text style={styles.label}>Largeur Épaules</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.largeurEpaules}
                        onChangeText={(value) => handleInputChange('largeurEpaules', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 45.50"
                    />

                    <Text style={styles.label}>Longueur Manche</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.longueurManche}
                        onChangeText={(value) => handleInputChange('longueurManche', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 65.00"
                    />

                    <Text style={styles.label}>Longueur Veste</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.longueurVeste}
                        onChangeText={(value) => handleInputChange('longueurVeste', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 75.00"
                    />
                </View>

                {/* Style Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Style</Text>

                    <Text style={styles.label}>Type de Revers</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.typeRevers === 'notch' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('typeRevers', 'notch')}
                        >
                            <Text style={[styles.optionButtonText, profile.typeRevers === 'notch' && styles.optionButtonTextActive]}>
                                Notch
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.typeRevers === 'peak' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('typeRevers', 'peak')}
                        >
                            <Text style={[styles.optionButtonText, profile.typeRevers === 'peak' && styles.optionButtonTextActive]}>
                                Peak
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.typeRevers === 'shawl' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('typeRevers', 'shawl')}
                        >
                            <Text style={[styles.optionButtonText, profile.typeRevers === 'shawl' && styles.optionButtonTextActive]}>
                                Shawl
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Nombre de Boutons</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.boutons === '1' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('boutons', '1')}
                        >
                            <Text style={[styles.optionButtonText, profile.boutons === '1' && styles.optionButtonTextActive]}>
                                1 Bouton
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.boutons === '2' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('boutons', '2')}
                        >
                            <Text style={[styles.optionButtonText, profile.boutons === '2' && styles.optionButtonTextActive]}>
                                2 Boutons
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.boutons === '3' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('boutons', '3')}
                        >
                            <Text style={[styles.optionButtonText, profile.boutons === '3' && styles.optionButtonTextActive]}>
                                3 Boutons
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Type de Poches</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.poches === 'patch' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('poches', 'patch')}
                        >
                            <Text style={[styles.optionButtonText, profile.poches === 'patch' && styles.optionButtonTextActive]}>
                                Patch
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.poches === 'flap' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('poches', 'flap')}
                        >
                            <Text style={[styles.optionButtonText, profile.poches === 'flap' && styles.optionButtonTextActive]}>
                                Flap
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.poches === 'besom' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('poches', 'besom')}
                        >
                            <Text style={[styles.optionButtonText, profile.poches === 'besom' && styles.optionButtonTextActive]}>
                                Besom
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Fente Ventrière</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.ventriere === 'aucune' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('ventriere', 'aucune')}
                        >
                            <Text style={[styles.optionButtonText, profile.ventriere === 'aucune' && styles.optionButtonTextActive]}>
                                Aucune
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.ventriere === 'centrale' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('ventriere', 'centrale')}
                        >
                            <Text style={[styles.optionButtonText, profile.ventriere === 'centrale' && styles.optionButtonTextActive]}>
                                Centrale
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, profile.ventriere === 'cote' && styles.optionButtonActive]}
                            onPress={() => handleInputChange('ventriere', 'cote')}
                        >
                            <Text style={[styles.optionButtonText, profile.ventriere === 'cote' && styles.optionButtonTextActive]}>
                                Côté
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Enregistrer le Profil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text style={styles.resetButtonText}>Réinitialiser</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.debugContainer}>
                    <Text style={styles.debugTitle}>Valeurs actuelles:</Text>
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
        marginBottom: 8,
        marginTop: 12,
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