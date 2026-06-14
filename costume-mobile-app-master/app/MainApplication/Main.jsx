import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Spacer from "../../components/Spacer";
import Themedtext from "../../components/Themedtext";
import { Link } from "expo-router";
import authService from '../../Services/authService';
import vesteService from '../../Services/VesteService';
import giletService from '../../Services/GiletService';
import { apiService } from '../../Services/api';
import costumeService from '../../Services/CostumeService';

const { width } = Dimensions.get('window');
// Calcul pour avoir exactement 2 colonnes avec des marges propres
const CARD_WIDTH = (width - 50) / 2;

const Main = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Erreur chargement utilisateur:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    const isAdmin = user?.role === 'Admin';

    const getPath = (type) => {
        if (isAdmin) {
            switch (type) {
                case 'veste': return "/MainApplication/VesteManagement";
                case 'pantalon': return "/MainApplication/PantalonManagement";
                case 'gilet': return "/MainApplication/GiletManagement";
                case 'costume': return "/MainApplication/CostumeManagement";
                default: return "/MainApplication/Home";
            }
        } else {
            switch (type) {
                case 'veste': return "/MainApplication/Profiles/VesteProfile";
                case 'pantalon': return "/MainApplication/Profiles/PantalonProfile";
                case 'gilet': return "/MainApplication/Profiles/GiletProfile";
                case 'costume': return "/MainApplication/Profiles/CostumeProfile";
                default: return "/MainApplication/Home";
            }
        }
    };

    if (loading) return null;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.greeting}>Bienvenue, {user?.firstName || ''}</Text>
                    <Text style={styles.tagline}>
                        {isAdmin ? "Espace d'administration" : "Créez votre costume parfait"}
                    </Text>
                </View>
            </View>

            {/* Navigation rapide supprimée selon demande */}


            <View style={styles.quickActionsSection}>
                <Text style={styles.quickActionsTitle}>Actions disponibles</Text>
                {!isAdmin && (
                    <TouchableOpacity
                        style={[styles.seedButton, seeding && { opacity: 0.7 }]}
                        disabled={seeding}
                        onPress={async () => {
                            try {
                                setSeeding(true);
                                const current = await authService.getCurrentUser();
                                if (!current?.id) throw new Error('Utilisateur non connecté');

                                // Seed Veste & Gilet
                                await vesteService.createDefaultProfiles(current.id);
                                await giletService.createDefaultProfiles(current.id);

                                // Seed Pantalon
                                const pantTemplates = [
                                    { profile_name: 'Pantalon Classique', tour_taille: 84, tour_hanches: 98, tour_cuisse: 56, tour_genou: 40, tour_cheville: 18, longueur_entrejambes: 82, longueur_totale: 106, coupe: 'regular', revers: 'non', type_ceinture: 'classique' },
                                    { profile_name: 'Pantalon Slim', tour_taille: 82, tour_hanches: 96, tour_cuisse: 54, tour_genou: 38, tour_cheville: 17, longueur_entrejambes: 81, longueur_totale: 105, coupe: 'slim', revers: 'oui', type_ceinture: 'classique' },
                                    { profile_name: 'Pantalon Décontracté', tour_taille: 86, tour_hanches: 100, tour_cuisse: 58, tour_genou: 41, tour_cheville: 19, longueur_entrejambes: 83, longueur_totale: 107, coupe: 'loose', revers: 'non', type_ceinture: 'elastique' },
                                    { profile_name: 'Pantalon Business', tour_taille: 85, tour_hanches: 99, tour_cuisse: 57, tour_genou: 40, tour_cheville: 18, longueur_entrejambes: 82, longueur_totale: 106, coupe: 'regular', revers: 'oui', type_ceinture: 'classique' },
                                ];
                                for (const t of pantTemplates) {
                                    await apiService.post('/pantalons/', { user_id: current.id, ...t }, true);
                                }

                                // Create 4 costumes referencing existing veste & pantalon
                                const [vRes, pRes, gRes] = await Promise.all([
                                    vesteService.getProfilesByUser(current.id),
                                    apiService.get(`/pantalons/user/${current.id}`, true),
                                    giletService.getProfilesByUser(current.id),
                                ]);
                                const vestes = (vRes?.data || (Array.isArray(vRes) ? vRes : [])).slice(0, 4);
                                const pantalons = (pRes?.data || (Array.isArray(pRes) ? pRes : [])).slice(0, 4);
                                const gilets = (gRes?.data || (Array.isArray(gRes) ? gRes : [])).slice(0, 4);
                                const names = ['Costume Business', 'Costume Casual', 'Costume Slim', 'Costume Cérémonie'];
                                const count = Math.min(vestes.length, pantalons.length, 4);
                                for (let i = 0; i < count; i++) {
                                    const payload = costumeService.validateCostumeData({
                                        name: names[i],
                                        userId: current.id,
                                        vesteProfileId: vestes[i]?.id,
                                        giletId: gilets[i]?.id || null,
                                        pantalonId: pantalons[i]?.id,
                                    });
                                    await costumeService.createCostume(payload);
                                }

                                Alert.alert('Succès', '4 profils créés pour Veste, Gilet, Pantalon et 4 Costumes.');
                            } catch (e) {
                                Alert.alert('Erreur', e?.message || 'Impossible de créer les profils.');
                            } finally {
                                setSeeding(false);
                            }
                        }}
                    >
                        {seeding ? (
                            <View style={styles.seedContent}>
                                <ActivityIndicator color="#fff" />
                                <Text style={styles.seedText}>Création des profils...</Text>
                            </View>
                        ) : (
                            <Text style={styles.seedText}>Créer 4 profils par catégorie</Text>
                        )}
                    </TouchableOpacity>
                )}

                {!isAdmin ? (
                    <>
                        {/* Ligne 1 */}
                        <View style={styles.actionsGrid}>
                            <Link href="/MainApplication/Profiles/Create/CreateVeste" asChild>
                                <TouchableOpacity style={styles.actionCard}>
                                    <View style={styles.categoryImageContainer}><Text style={styles.categoryEmoji}>👔</Text></View>
                                    <Text style={styles.actionText}>Nouvelle Veste</Text>
                                </TouchableOpacity>
                            </Link>

                            <Link href="/MainApplication/Profiles/Create/CreatePantalon" asChild>
                                <TouchableOpacity style={styles.actionCard}>
                                    <View style={styles.categoryImageContainer}><Text style={styles.categoryEmoji}>👖</Text></View>
                                    <Text style={styles.actionText}>Nouveau Pantalon</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                        <View style={styles.actionsGrid}>

                            {/* Ligne 2 */}
                            <Link href="/MainApplication/Profiles/Create/CreateGilet" asChild>
                                <TouchableOpacity style={styles.actionCard}>
                                    <View style={styles.categoryImageContainer}><Text style={styles.categoryEmoji}>🦺</Text></View>
                                    <Text style={styles.actionText}>Nouveau Gilet</Text>
                                </TouchableOpacity>
                            </Link>

                            <Link href="/MainApplication/Profiles/Create/CreateCostume" asChild>
                                <TouchableOpacity style={styles.actionCard}>
                                    <View style={styles.categoryImageContainer}><Text style={styles.categoryEmoji}>🧥</Text></View>
                                    <Text style={styles.actionText}>Composer un Costume</Text>
                                </TouchableOpacity>
                            </Link>


                            <Link href="/MainApplication/MyProfiles" asChild>
                                <TouchableOpacity style={styles.actionCard}>
                                    <View style={styles.categoryImageContainer}><Text style={styles.categoryEmoji}>📋</Text></View>
                                    <Text style={styles.actionText}>Mes Profils</Text>
                                </TouchableOpacity>
                            </Link>

                            <Link href="/MainApplication/Booking/AppointmentBooking" asChild>
                                <TouchableOpacity style={styles.actionCard}>
                                    <View style={styles.categoryImageContainer}><Text style={styles.categoryEmoji}>📅</Text></View>
                                    <Text style={styles.actionText}>Prendre Rendez-vous</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </>
                ) : (
                    <View style={styles.actionsGrid}>
                        <Link href="/MainApplication/UserManagement" asChild>
                            <TouchableOpacity style={[styles.actionCard, styles.greenCard, { width: width - 40 }]}>
                                <Text style={styles.actionIcon}>👥</Text>
                                <Text style={styles.actionText}>Gérer les Profils Clients</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                )}
            </View>

            <Spacer height={40} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { backgroundColor: '#000000', padding: 32, paddingTop: 72, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, elevation: 8, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
    welcomeSection: { marginBottom: 12 },
    greeting: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
    tagline: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 6 },

    categoriesSection: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryCard: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 20, alignItems: 'center', marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    categoryImageContainer: { backgroundColor: '#f0f4ff', padding: 10, borderRadius: 50, marginBottom: 8 },
    categoryEmoji: { fontSize: 24 },
    categoryTitle: { fontWeight: '600', color: '#334155' },

    quickActionsSection: { marginTop: 24, paddingHorizontal: 20 },
    quickActionsTitle: { fontSize: 20, fontWeight: '800', marginBottom: 18, color: '#0f172a', letterSpacing: 0.3 },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'

    },
    seedButton: { backgroundColor: '#D32F2F', paddingVertical: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
    seedContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    seedText: { color: '#111111', fontWeight: '800', fontSize: 16 },
    actionCard: { width: '48%', backgroundColor: '#111111', paddingVertical: 22, paddingHorizontal: 16, borderRadius: 24, alignItems: 'center', marginBottom: 14, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, borderWidth: 1, borderColor: '#333333' },
    purpleCard: { backgroundColor: '#f5f3ff' },
    pinkCard: { backgroundColor: '#fff1f2' },
    blueCard: { backgroundColor: '#eff6ff' },
    greenCard: { backgroundColor: '#f0fdf4' },
    actionIcon: { fontSize: 32, marginBottom: 10 },
    actionText: { fontWeight: '800', textAlign: 'center', color: '#D32F2F', fontSize: 16, letterSpacing: 0.2 },
});

export default Main;