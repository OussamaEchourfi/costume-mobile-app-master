import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import pantalonService from "../../../../Services/PantalonService";
import { router } from "expo-router";
import authService from "../../../../Services/authService";

export default function PantalonProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState({
        user_id: 0,
        profile_name: 'Profil Pantalon',
        tour_taille: '',
        tour_hanches: '',
        tour_cuisse: '',
        tour_genou: '',
        tour_cheville: '',
        longueur_entrejambes: '',
        longueur_totale: '',
        coupe: 'regular',
        revers: 'non',
        type_ceinture: 'classique'
    });

    useEffect(() => {
        const getCurrentUserId = async () => {
            const userId = await authService.getCurrentUserId();
            setProfile(prev => ({ ...prev, user_id: userId }));
        };
        getCurrentUserId();
    }, []);

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!profile.tour_taille || !profile.tour_hanches) {
            Alert.alert('Erreur', 'Tour de taille et hanches sont requis');
            return;
        }

        setIsLoading(true);

        try {
            const validatedData = pantalonService.validateProfileData(profile);
            const result = await pantalonService.createProfile(validatedData);
            Alert.alert("Succès", "Profil de pantalon enregistré !");
            router.back();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            Alert.alert("Erreur", error.message || "Impossible de créer le profil");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setProfile(prev => ({
            ...prev,
            profile_name: 'Profil Pantalon',
            tour_taille: '',
            tour_hanches: '',
            tour_cuisse: '',
            tour_genou: '',
            tour_cheville: '',
            longueur_entrejambes: '',
            longueur_totale: '',
            coupe: 'regular',
            revers: 'non',
            type_ceinture: 'classique'
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profil de Pantalon</Text>
                <Text style={styles.headerSubtitle}>Configurez vos mesures et préférences</Text>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Nom du profil */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nom du Profil</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.profile_name}
                        onChangeText={(value) => handleInputChange('profile_name', value)}
                        maxLength={100}
                        placeholder="Nom du profil"
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mesures (cm)</Text>

                    <Text style={styles.label}>Tour de Taille *</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tour_taille}
                        onChangeText={(value) => handleInputChange('tour_taille', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 85.00"
                    />

                    <Text style={styles.label}>Tour de Hanches *</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tour_hanches}
                        onChangeText={(value) => handleInputChange('tour_hanches', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 95.00"
                    />

                    <Text style={styles.label}>Tour de Cuisse</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tour_cuisse}
                        onChangeText={(value) => handleInputChange('tour_cuisse', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 58.00"
                    />

                    <Text style={styles.label}>Tour de Genou</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tour_genou}
                        onChangeText={(value) => handleInputChange('tour_genou', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 38.00"
                    />

                    <Text style={styles.label}>Tour de Cheville</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.tour_cheville}
                        onChangeText={(value) => handleInputChange('tour_cheville', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 18.00"
                    />

                    <Text style={styles.label}>Longueur Entre-jambe</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.longueur_entrejambes}
                        onChangeText={(value) => handleInputChange('longueur_entrejambes', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 82.00"
                    />

                    <Text style={styles.label}>Longueur Totale</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.longueur_totale}
                        onChangeText={(value) => handleInputChange('longueur_totale', value)}
                        keyboardType="decimal-pad"
                        placeholder="ex: 108.00"
                    />
                </View>

                {/* Style Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Style</Text>

                    <Text style={styles.label}>Coupe</Text>
                    <View style={styles.buttonGroup}>
                        {['slim', 'regular', 'loose'].map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[
                                    styles.optionButton,
                                    profile.coupe === c && styles.optionButtonActive
                                ]}
                                onPress={() => handleInputChange('coupe', c)}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    profile.coupe === c && styles.optionButtonTextActive
                                ]}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Revers</Text>
                    <View style={styles.buttonGroup}>
                        {['oui', 'non'].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[
                                    styles.optionButton,
                                    profile.revers === r && styles.optionButtonActive
                                ]}
                                onPress={() => handleInputChange('revers', r)}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    profile.revers === r && styles.optionButtonTextActive
                                ]}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Type de Ceinture</Text>
                    <View style={styles.buttonGroup}>
                        {['classique', 'elastique'].map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[
                                    styles.optionButton,
                                    profile.type_ceinture === t && styles.optionButtonActive
                                ]}
                                onPress={() => handleInputChange('type_ceinture', t)}
                            >
                                <Text style={[
                                    styles.optionButtonText,
                                    profile.type_ceinture === t && styles.optionButtonTextActive
                                ]}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Enregistrer le Profil</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text style={styles.resetButtonText}>Réinitialiser</Text>
                    </TouchableOpacity>
                </View>

                {/* Debug View */}
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
    }
});