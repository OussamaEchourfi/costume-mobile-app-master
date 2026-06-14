import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Platform,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Spacer from '../../../components/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import authService from '../../../Services/authService'; // Import authService

const AppointmentBooking = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [appointmentType, setAppointmentType] = useState('measurements'); // measurements, fitting_1, fitting_2
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user && user.id) {
                    setUserId(user.id);
                }
            } catch (e) {
                console.error("Failed to load user for booking", e);
            }
        };
        loadUser();
    }, []);

    // Mock time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30'
    ];

    const onDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setSelectedTime(null); // Reset time when date changes
        }
    };

    const handleBook = async () => {
        if (!selectedTime) {
            Alert.alert('Attention', 'Veuillez sélectionner une heure de rendez-vous.');
            return;
        }

        if (!userId) {
            Alert.alert('Erreur', 'Utilisateur non identifié. Veuillez vous reconnecter.');
            return;
        }

        try {
            const newAppointment = {
                id: Date.now().toString(),
                date: selectedDate.toISOString(),
                time: selectedTime,
                type: appointmentType,
                status: 'confirmed'
            };

            const key = `appointments_${userId}`;
            // Retrieve existing appointments
            const existingData = await AsyncStorage.getItem(key);
            const appointments = existingData ? JSON.parse(existingData) : [];

            // Add new appointment
            appointments.push(newAppointment);

            // Save back to storage
            await AsyncStorage.setItem(key, JSON.stringify(appointments));

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error saving appointment:', error);
            Alert.alert('Erreur', 'Impossible de sauvegarder le rendez-vous.');
        }
    };

    const renderTypeCard = (id, icon, title, subtitle) => (
        <TouchableOpacity
            style={[
                styles.typeCard,
                appointmentType === id && styles.typeCardSelected
            ]}
            onPress={() => setAppointmentType(id)}
            activeOpacity={0.7}
        >
            <View style={[
                styles.typeIconContainer,
                appointmentType === id && styles.typeIconContainerSelected
            ]}>
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={appointmentType === id ? '#fff' : '#1e293b'}
                />
            </View>
            <View style={styles.typeContent}>
                <Text style={[
                    styles.typeTitle,
                    appointmentType === id && styles.typeTitleSelected
                ]}>{title}</Text>
                <Text style={[
                    styles.typeSubtitle,
                    appointmentType === id && styles.typeSubtitleSelected
                ]}>{subtitle}</Text>
            </View>
            {appointmentType === id && (
                <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#D32F2F" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rendez-vous</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. Appointment Type */}
                <Text style={styles.sectionTitle}>1. Type de rendez-vous</Text>
                {renderTypeCard('measurements', 'tape-measure', 'Prise de Mesures', 'Pour votre premier costume')}
                {renderTypeCard('fitting_1', 'tshirt-crew', 'Premier Essayage', 'Ajustements initiaux')}
                {renderTypeCard('fitting_2', 'content-cut', 'Essayage Final', 'Dernières retouches')}

                <Spacer height={25} />

                {/* 2. Date Selection */}
                <Text style={styles.sectionTitle}>2. Choisir la date</Text>
                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar-outline" size={24} color="#D32F2F" />
                    <Text style={styles.dateText}>
                        {selectedDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#94a3b8" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                        accentColor="#D32F2F"
                    />
                )}

                <Spacer height={25} />

                {/* 3. Time Selection */}
                <Text style={styles.sectionTitle}>3. Choisir l'heure</Text>
                <View style={styles.timeGrid}>
                    {timeSlots.map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeSlot,
                                selectedTime === time && styles.timeSlotSelected
                            ]}
                            onPress={() => setSelectedTime(time)}
                        >
                            <Text style={[
                                styles.timeText,
                                selectedTime === time && styles.timeTextSelected
                            ]}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Spacer height={40} />

                {/* Book Button */}
                <TouchableOpacity
                    style={[
                        styles.bookButton,
                        (!selectedTime) && styles.bookButtonDisabled
                    ]}
                    onPress={handleBook}
                    disabled={!selectedTime}
                >
                    <Text style={styles.bookButtonText}>Confirmer le Rendez-vous</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="checkmark" size={40} color="#fff" />
                        </View>
                        <Text style={styles.modalTitle}>Réservé !</Text>
                        <Text style={styles.modalText}>
                            Votre rendez-vous pour le {selectedDate.toLocaleDateString('fr-FR')} à {selectedTime} a été confirmé.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.back();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Super</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748b', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },

    // Type Cards
    typeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    typeCardSelected: {
        borderColor: '#D32F2F',
        backgroundColor: '#fff1f2',
    },
    typeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    typeIconContainerSelected: {
        backgroundColor: '#D32F2F',
    },
    typeContent: { flex: 1 },
    typeTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 2 },
    typeSubtitle: { fontSize: 13, color: '#64748b' },
    typeTitleSelected: { color: '#D32F2F' },
    typeSubtitleSelected: { color: '#ef4444' },
    checkIcon: { marginLeft: 10 },

    // Date Selector
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dateText: { flex: 1, fontSize: 16, color: '#1e293b', fontWeight: '500', marginLeft: 12, textTransform: 'capitalize' },

    // Time Grid
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeSlot: {
        width: '31%',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 12,
        alignItems: 'center',
    },
    timeSlotSelected: {
        backgroundColor: '#D32F2F',
        borderColor: '#D32F2F',
    },
    timeText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    timeTextSelected: { color: '#fff' },

    // Book Button
    bookButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#D32F2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    bookButtonDisabled: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
        elevation: 0,
    },
    bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '85%',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
    modalText: { textAlign: 'center', color: '#64748b', fontSize: 15, lineHeight: 22, marginBottom: 25 },
    modalButton: { backgroundColor: '#1e293b', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
    modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AppointmentBooking;
