import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileNavigationButtons = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.subtitle}>Gérer vos mesures</Text>
                <Text style={styles.title}>Mes Profils</Text>
            </View>

            {/* LISTE DES BOUTONS */}
            <ScrollView
                contentContainerStyle={styles.buttonGrid}
                showsVerticalScrollIndicator={false}
            >

                {/* 1. Bouton Costumes (L'ensemble complet) */}
                <TouchableOpacity
                    style={[styles.card, { borderLeftColor: '#f1c40f' }]}
                    onPress={() => router.push('/MainApplication/Profiles/Costume_profile')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#fef9e7' }]}>
                        <MaterialCommunityIcons name="black-mesa" size={28} color="#f1c40f" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Mes Costumes</Text>
                        <Text style={styles.cardDesc}>Ensembles complets et combinaisons</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                {/* 2. Bouton Veste */}
                <TouchableOpacity
                    style={[styles.card, { borderLeftColor: '#3498db' }]}
                    onPress={() => router.push('/MainApplication/Profiles/Veste_profile')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#e1f5fe' }]}>
                        <MaterialCommunityIcons name="tshirt-crew" size={28} color="#3498db" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Veste</Text>
                        <Text style={styles.cardDesc}>Blazers, vestes et manteaux</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                {/* 3. Bouton Gilet */}
                <TouchableOpacity
                    style={[styles.card, { borderLeftColor: '#e74c3c' }]}
                    onPress={() => router.push('/MainApplication/Profiles/Gilet_profile')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#fdeaea' }]}>
                        <MaterialCommunityIcons name="vest" size={28} color="#e74c3c" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Gilet</Text>
                        <Text style={styles.cardDesc}>Gilets de costume et sans manches</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                {/* 4. Bouton Pantalon */}
                <TouchableOpacity
                    style={[styles.card, { borderLeftColor: '#2ecc71' }]}
                    onPress={() => router.push('/MainApplication/Profiles/Pantalon_profile')}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#e8f8f0' }]}>
                        <MaterialCommunityIcons name="human-male" size={28} color="#2ecc71" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Pantalon</Text>
                        <Text style={styles.cardDesc}>Pantalons, jeans et shorts</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 25,
        paddingTop: 40,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    buttonGrid: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        borderLeftWidth: 5,
        // Ombre pour iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        // Ombre pour Android
        elevation: 3,
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3436',
    },
    cardDesc: {
        fontSize: 13,
        color: '#636E72',
        marginTop: 2,
    },
});

export default ProfileNavigationButtons;