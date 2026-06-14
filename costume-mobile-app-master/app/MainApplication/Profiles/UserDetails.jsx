import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image // Import Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, Link } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import des services
import UserService from '../../../Services/UserService';
import authService from '../../../Services/authService';

const UserDetails = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null); // State for image
    const [appointments, setAppointments] = useState([]); // State for appointments

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await UserService.getCurrentUser();

            // LOG pour déboguer et voir la structure réelle
            console.log("Données reçues du serveur :", response);

            if (response && response.success) {
                const userData = response.data;
                setUser(userData);
                // Once we have the user, we can fetch their specific data
                if (userData?.id) {
                    await fetchUserSpecificData(userData.id);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Erreur fetchUserProfile:", error);
            if (error.status === 401) {
                router.replace('/Login');
            } else {
                Alert.alert("Erreur", "Impossible de charger vos informations.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        Alert.alert(
            "Annuler le rendez-vous",
            "Êtes-vous sûr de vouloir annuler ce rendez-vous ?",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Filter out the deleted appointment
                            const updatedAppointments = appointments.filter(a => a.id !== appointmentId);
                            setAppointments(updatedAppointments);

                            // Update AsyncStorage
                            if (user?.id) {
                                await AsyncStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
                            }
                        } catch (e) {
                            console.error("Error deleting appointment", e);
                            Alert.alert("Erreur", "Impossible d'annuler le rendez-vous.");
                        }
                    }
                }
            ]
        );
    };

    const fetchUserSpecificData = async (userId) => {
        try {
            // 1. Fetch Appointments
            const aptKey = `appointments_${userId}`;
            const aptData = await AsyncStorage.getItem(aptKey);
            if (aptData) {
                const parsed = JSON.parse(aptData);
                parsed.sort((a, b) => new Date(a.date) - new Date(b.date));
                setAppointments(parsed);
            }

            // 2. Fetch Profile Image
            const imgKey = `profile_image_${userId}`;
            const savedImage = await AsyncStorage.getItem(imgKey);
            if (savedImage) {
                setImage(savedImage);
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    // Reload appointments when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user?.id) {
                fetchUserSpecificData(user.id);
            }
        }, [user])
    );

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled && user?.id) {
            const uri = result.assets[0].uri;
            setImage(uri);
            // Save to storage
            try {
                await AsyncStorage.setItem(`profile_image_${user.id}`, uri);
            } catch (e) {
                console.error("Failed to save image", e);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            console.log("Redirection vers /Login...");
            setImage(null);
            setAppointments([]);

            setTimeout(() => {
                router.replace('/Login');
            }, 0);

        } catch (error) {
            console.error("Erreur handleLogout:", error);
            router.replace('/Login');
        }
    };

    const formatDate = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#D32F2F" />
                <Text style={styles.loadingText}>Chargement de votre profil...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="account-alert-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>Profil introuvable</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.replace('/Login')}
                    >
                        <Text style={styles.createButtonText}>Se reconnecter</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mon Profil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatarImage} />
                        ) : (
                            <MaterialCommunityIcons name="account" size={50} color="#fff" />
                        )}
                        <View style={styles.editIconBadge}>
                            <MaterialCommunityIcons name="pencil" size={14} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.profileName}>
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text style={styles.userRole}>{user.role || 'Utilisateur'}</Text>
                </View>

                {/* --- MEASUREMENTS SECTION --- */}
                <View style={styles.sectionCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Mesures Corporelles</Text>
                        <Link href="/MainApplication/Profiles/MyMeasurements" asChild>
                            <TouchableOpacity>
                                <Text style={{ color: '#D32F2F', fontWeight: 'bold', fontSize: 13 }}>Modifier</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    <Link href="/MainApplication/Profiles/MyMeasurements" asChild>
                        <TouchableOpacity style={styles.measurementPreview}>
                            <View style={styles.tapeIcon}>
                                <MaterialCommunityIcons name="tape-measure" size={24} color="#D32F2F" />
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b' }}>Mon Digital Tape</Text>
                                <Text style={{ fontSize: 12, color: '#64748b' }}>Gérez vos mensurations pour la taille idéale</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* --- APPOINTMENTS SECTION --- */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Mes Rendez-vous</Text>
                    {appointments.length === 0 ? (
                        <Text style={styles.noDataText}>Aucun rendez-vous prévu.</Text>
                    ) : (
                        appointments.map((apt) => (
                            <View key={apt.id} style={styles.appointmentRow}>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateBoxText}>{formatDate(apt.date)}</Text>
                                </View>
                                <View style={styles.aptDetails}>
                                    <Text style={styles.aptType}>
                                        {apt.type === 'measurements' ? 'Prise de Mesures' :
                                            apt.type === 'fitting_1' ? 'Premier Essayage' : 'Essayage Final'}
                                    </Text>
                                    <View style={styles.timeRow}>
                                        <Ionicons name="time-outline" size={14} color="#64748b" />
                                        <Text style={styles.aptTime}>{apt.time}</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end', gap: 5 }}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Confirmé</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleDeleteAppointment(apt.id)} hitSlop={10}>
                                        <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Informations de contact</Text>

                    <InfoRow icon="account-outline" label="Prénom" value={user.firstName} />
                    <InfoRow icon="account-outline" label="Nom" value={user.lastName} />
                    <InfoRow icon="email-outline" label="Email" value={user.email} />
                    <InfoRow icon="phone-outline" label="Téléphone" value={user.phone || 'Non renseigné'} />
                </View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <MaterialCommunityIcons name="logout" size={20} color="#e74c3c" />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <MaterialCommunityIcons name={icon} size={22} color="#D32F2F" />
        <View style={styles.textContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#64748b' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    scrollContent: { paddingBottom: 30 },
    profileHeader: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        elevation: 2,
    },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#D32F2F', justifyContent: 'center',
        alignItems: 'center', marginBottom: 15,
        position: 'relative'
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1e293b',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    },
    profileName: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
    userRole: { fontSize: 14, color: '#94a3b8', marginTop: 5 },
    sectionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        elevation: 1,
    },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    textContainer: { marginLeft: 15 },
    infoLabel: { fontSize: 12, color: '#64748b' },
    infoValue: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    detailLabel: { flex: 1, marginLeft: 10, fontSize: 15, color: '#475569' },
    detailValue: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#fee2e2'
    },
    logoutText: { marginLeft: 10, color: '#e74c3c', fontWeight: 'bold', fontSize: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginTop: 20, marginBottom: 20 },
    createButton: { backgroundColor: '#1e293b', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12 },
    createButtonText: { color: '#fff', fontWeight: 'bold' },

    // Appointment Styles
    noDataText: { color: '#94a3b8', fontStyle: 'italic', marginBottom: 5 },
    appointmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    dateBox: {
        backgroundColor: '#e2e8f0',
        padding: 8,
        borderRadius: 8,
        marginRight: 12,
        minWidth: 50,
        alignItems: 'center'
    },
    dateBoxText: { fontWeight: 'bold', color: '#1e293b', fontSize: 12 },
    aptDetails: { flex: 1 },
    aptType: { fontWeight: '600', color: '#1e293b', fontSize: 14, marginBottom: 2 },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    aptTime: { fontSize: 12, color: '#64748b' },
    badge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    badgeText: { color: '#16a34a', fontSize: 10, fontWeight: 'bold' },

    // Measurement Card Styles
    measurementPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    tapeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    }
});

export default UserDetails;