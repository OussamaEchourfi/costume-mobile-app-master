import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import UserService from '../../Services/UserService';
import { Ionicons } from '@expo/vector-icons';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await UserService.getAllUsers();
            if (response && response.success) {
                const usersList = response.data.data || response.data;
                setUsers(Array.isArray(usersList) ? usersList : []);
            }
        } catch (error) {
            console.error("Erreur LoadUsers:", error);
            Alert.alert("Erreur", "Impossible de charger les utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer cet utilisateur ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await UserService.deleteUser(id);
                            setUsers(users.filter(u => u.id !== id));
                            Alert.alert("Succès", "Utilisateur supprimé");
                        } catch (e) {
                            Alert.alert("Erreur", "Échec de la suppression");
                        }
                    }
                }
            ]
        );
    };

    const openEditModal = (user) => {
        setSelectedUser({ ...user });
        setModalVisible(true);
    };

    // Correction : Suppression du 's' parasite ici
    const handleUpdate = async () => {
        try {
            await UserService.updateUser(selectedUser.id, selectedUser);
            setModalVisible(false);
            loadUsers();
            Alert.alert("Succès", "Informations mises à jour");
        } catch (e) {
            // Affichage de l'erreur précise venant du backend (ex: email déjà pris)
            const errorMsg = e.response?.data?.message || "Échec de la mise à jour";
            Alert.alert("Erreur", errorMsg);
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={[styles.roleBadge, item.role === 'Admin' ? styles.adminBadge : styles.clientBadge]}>
                    <Text style={styles.roleText}>{item.role}</Text>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                    <Ionicons name="pencil" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#1e3a8a" style={{flex: 1}} />;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Gestion Utilisateurs ({users.length})</Text>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUserItem}
                contentContainerStyle={styles.listContent}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier Utilisateur</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Prénom</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedUser?.firstName}
                                onChangeText={(text) => setSelectedUser({...selectedUser, firstName: text})}
                            />

                            <Text style={styles.label}>Nom</Text>
                            <TextInput
                                style={styles.input}
                                value={selectedUser?.lastName}
                                onChangeText={(text) => setSelectedUser({...selectedUser, lastName: text})}
                            />

                            {/* Correction : Sortie de l'email du container Rôle */}
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={selectedUser?.email}
                                onChangeText={(text) => setSelectedUser({...selectedUser, email: text})}
                            />

                            <Text style={styles.label}>Rôle</Text>
                            <View style={styles.rolePickerContainer}>
                                <TouchableOpacity
                                    style={[styles.roleOption, selectedUser?.role === 'Client' && styles.roleActive]}
                                    onPress={() => setSelectedUser({...selectedUser, role: 'Client'})}
                                >
                                    <Text style={selectedUser?.role === 'Client' ? styles.roleTextActive : {}}>Client</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleOption, selectedUser?.role === 'Admin' && styles.roleActive]}
                                    onPress={() => setSelectedUser({...selectedUser, role: 'Admin'})}
                                >
                                    <Text style={selectedUser?.role === 'Admin' ? styles.roleTextActive : {}}>Admin</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={{color: '#64748b'}}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
                                <Text style={{color: '#fff', fontWeight: 'bold'}}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Ajout de quelques styles manquants pour le texte actif
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#1e293b' },
    listContent: { paddingBottom: 20 },
    userCard: {
        backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2
    },
    userName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    userEmail: { fontSize: 14, color: '#64748b', marginVertical: 2 },
    roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
    adminBadge: { backgroundColor: '#fee2e2' },
    clientBadge: { backgroundColor: '#dcfce7' },
    roleText: { fontSize: 12, fontWeight: '600' },
    actionButtons: { flexDirection: 'row', gap: 10 },
    editButton: { padding: 8, backgroundColor: '#eff6ff', borderRadius: 8 },
    deleteButton: { padding: 8, backgroundColor: '#fef2f2', borderRadius: 8 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '90%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    label: { fontSize: 14, color: '#64748b', marginBottom: 5, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, marginBottom: 15, color: '#1e293b' },
    rolePickerContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    roleOption: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, alignItems: 'center' },
    roleActive: { backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
    roleTextActive: { color: '#1e40af', fontWeight: 'bold' },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
    cancelButton: { padding: 12 },
    saveButton: { backgroundColor: '#1e3a8a', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }
});

export default UserManagement;