import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../..//Services/authService';
import vesteService from '../../../Services/VesteService';
import giletService from '../../../Services/GiletService';
import { apiService } from '../../../Services/api';
import costumeService from '../../../Services/CostumeService';

export default function ProfilesQuickNav() {
  const [seeding, setSeeding] = useState(false);
  const items = [
    {
      label: 'Mes Profils Veste',
      href: 'Veste_profile',
      icon: <MaterialCommunityIcons name="tshirt-crew" size={22} color="#1e3a8a" />,
      color: '#e1f0ff',
    },
    {
      label: 'Mes Profils Gilet',
      href: 'Gilet_profile',
      icon: <MaterialCommunityIcons name="tshirt-v" size={22} color="#e74c3c" />,
      color: '#fdeaea',
    },
    {
      label: 'Mes Profils Pantalon',
      href: 'Pantalon_profile',
      icon: <MaterialCommunityIcons name="human-male" size={22} color="#2ecc71" />,
      color: '#e8f8f0',
    },
    {
      label: 'Mes Costumes',
      href: 'Costume_profile',
      icon: <MaterialCommunityIcons name="black-mesa" size={22} color="#8e44ad" />,
      color: '#f3e8ff',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>      
      <View style={styles.header}>        
        <Text style={styles.title}>Navigation Rapide</Text>
        <Text style={styles.subtitle}>Accédez directement à vos profils</Text>
      </View>

      <TouchableOpacity
        style={[styles.seedButton, seeding && styles.seedButtonDisabled]}
        disabled={seeding}
        onPress={async () => {
          try {
            setSeeding(true);
            const user = await authService.getCurrentUser();
            if (!user?.id) throw new Error('Utilisateur non connecté');

            // Veste & Gilet
            await vesteService.createDefaultProfiles(user.id);
            await giletService.createDefaultProfiles(user.id);

            // Pantalon (inline templates)
            const pantTemplates = [
              { profile_name: 'Pantalon Classique', tour_taille: 84, tour_hanches: 98, tour_cuisse: 56, tour_genou: 40, tour_cheville: 18, longueur_entrejambes: 82, longueur_totale: 106, coupe: 'regular', revers: 'non', type_ceinture: 'classique' },
              { profile_name: 'Pantalon Slim', tour_taille: 82, tour_hanches: 96, tour_cuisse: 54, tour_genou: 38, tour_cheville: 17, longueur_entrejambes: 81, longueur_totale: 105, coupe: 'slim', revers: 'oui', type_ceinture: 'classique' },
              { profile_name: 'Pantalon Décontracté', tour_taille: 86, tour_hanches: 100, tour_cuisse: 58, tour_genou: 41, tour_cheville: 19, longueur_entrejambes: 83, longueur_totale: 107, coupe: 'loose', revers: 'non', type_ceinture: 'elastique' },
              { profile_name: 'Pantalon Business', tour_taille: 85, tour_hanches: 99, tour_cuisse: 57, tour_genou: 40, tour_cheville: 18, longueur_entrejambes: 82, longueur_totale: 106, coupe: 'regular', revers: 'oui', type_ceinture: 'classique' },
            ];
            for (const t of pantTemplates) {
              await apiService.post('/pantalons/', { user_id: user.id, ...t }, true);
            }

            // Costumes: must reference existing veste & pantalon profiles
            // Fetch fresh lists after seeding Veste/Pantalon
            const [vRes, pRes, gRes] = await Promise.all([
              vesteService.getProfilesByUser(user.id),
              apiService.get(`/pantalons/user/${user.id}`, true),
              giletService.getProfilesByUser(user.id),
            ]);
            const vestes = (vRes?.data || (Array.isArray(vRes) ? vRes : [])).slice(0, 4);
            const pantalons = (pRes?.data || (Array.isArray(pRes) ? pRes : [])).slice(0, 4);
            const gilets = (gRes?.data || (Array.isArray(gRes) ? gRes : [])).slice(0, 4);

            const pairsCount = Math.min(vestes.length, pantalons.length, 4);
            if (pairsCount > 0) {
              const costumeDefaults = ['Costume Business','Costume Casual','Costume Slim','Costume Cérémonie'];
              for (let i = 0; i < pairsCount; i++) {
                const payload = costumeService.validateCostumeData({
                  name: costumeDefaults[i],
                  userId: user.id,
                  vesteProfileId: vestes[i]?.id,
                  giletId: gilets[i]?.id || null,
                  pantalonId: pantalons[i]?.id,
                });
                await costumeService.createCostume(payload);
              }
            }

            Alert.alert('Succès', '4 profils créés pour Veste, Gilet, Pantalon et 4 Costumes.');
          } catch (e) {
            Alert.alert('Erreur', e?.message || 'Impossible de créer les profils par défaut.');
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

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingVertical: 10 },
  seedButton: { marginHorizontal: 20, backgroundColor: '#1e3a8a', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  seedButtonDisabled: { opacity: 0.7 },
  seedContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seedText: { color: '#fff', fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconBox: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  label: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
});
