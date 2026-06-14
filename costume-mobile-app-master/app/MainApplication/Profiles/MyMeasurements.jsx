import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../../Services/authService';
import Spacer from '../../../components/Spacer';

const MyMeasurements = () => {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [measurements, setMeasurements] = useState({
        shoulders: '',
        chest: '',
        waist: '',
        hips: '',
        inseam: '',
    });

    const [recommendedSize, setRecommendedSize] = useState('?');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const user = await authService.getCurrentUser();
            if (user?.id) {
                setUserId(user.id);
                const saved = await AsyncStorage.getItem(`measurements_${user.id}`);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setMeasurements(parsed);
                    calculateSize(parsed);
                }
            }
        } catch (e) {
            console.error("Error loading measurements", e);
        } finally {
            setLoading(false);
        }
    };

    const calculateSize = (data) => {
        // Simple logic for demo purposes
        // Based roughly on chest size (cm)
        const chest = parseFloat(data.chest);
        let size = '?';

        if (!isNaN(chest)) {
            if (chest < 88) size = 'XS';
            else if (chest < 96) size = 'S';
            else if (chest < 104) size = 'M';
            else if (chest < 112) size = 'L';
            else if (chest < 120) size = 'XL';
            else size = 'XXL';
        }
        setRecommendedSize(size);
    };

    const handleSave = async () => {
        if (!userId) return;
        try {
            await AsyncStorage.setItem(`measurements_${userId}`, JSON.stringify(measurements));
            calculateSize(measurements);
            Alert.alert("Succès", "Vos mesures ont été sauvegardées.");
        } catch (e) {
            Alert.alert("Erreur", "Impossible de sauvegarder.");
        }
    };

    const handleChange = (field, value) => {
        setMeasurements(prev => ({ ...prev, [field]: value }));
    };

    const renderInput = (label, field, icon, placeholder) => (
        <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
                <MaterialCommunityIcons name={icon} size={20} color="#64748b" />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={measurements[field]}
                    onChangeText={(text) => handleChange(field, text)}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    maxLength={3}
                />
                <Text style={styles.unit}>cm</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mes Mesures</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Size Card */}
                    <View style={styles.sizeCard}>
                        <Text style={styles.sizeLabel}>Taille Recommandée</Text>
                        <View style={styles.sizeCircle}>
                            <Text style={styles.sizeValue}>{recommendedSize}</Text>
                        </View>
                        <Text style={styles.sizeNote}>Basé sur votre tour de poitrine</Text>
                    </View>

                    <Text style={styles.instructions}>
                        Entrez vos mesures en cm pour obtenir des recommandations précises.
                    </Text>

                    <View style={styles.formCard}>
                        {renderInput('Épaules (Carrure)', 'shoulders', 'arrow-expand-horizontal', '45')}
                        {renderInput('Tour de Poitrine', 'chest', 'tshirt-crew-outline', '100')}
                        {renderInput('Tour de Taille', 'waist', 'human-male-height', '85')}
                        {renderInput('Tour de Hanches', 'hips', 'human-male', '95')}
                        {renderInput('Entrejambe', 'inseam', 'arrow-expand-vertical', '80')}
                    </View>

                    <Spacer height={30} />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Sauvegarder</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
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
    content: { padding: 20 },

    sizeCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    sizeLabel: { color: '#94a3b8', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
    sizeCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D32F2F',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    sizeValue: { color: '#fff', fontSize: 32, fontWeight: '800' },
    sizeNote: { color: '#64748b', fontSize: 12 },

    instructions: { color: '#64748b', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },

    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputGroup: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    label: { fontSize: 14, color: '#475569', fontWeight: '600' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#1e293b', fontWeight: '500' },
    unit: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },

    saveButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default MyMeasurements;
