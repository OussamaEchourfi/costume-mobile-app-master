import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MainApplicationLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: styles.footer,
                tabBarActiveTintColor: "#151235",
                tabBarInactiveTintColor: "#94a3b8",
                headerShown: false,
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
            }}
        >
            {/* 1. SEULEMENT L'ONGLET ACCUEIL */}
            <Tabs.Screen
                name="Main"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />

            {/* 2. SEULEMENT L'ONGLET PROFIL */}
            <Tabs.Screen
                name="Profiles/UserDetails"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />

            {/* --- CACHER TOUTES LES AUTRES PAGES --- */}
            {/* On utilise href: null pour que la page existe mais n'ait pas d'onglet */}

            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="MyProfiles" options={{ href: null }} />
            <Tabs.Screen name="UserManagement" options={{ href: null }} />
            <Tabs.Screen name="VesteManagement" options={{ href: null }} />
            <Tabs.Screen name="PantalonManagement" options={{ href: null }} />
            <Tabs.Screen name="GiletManagement" options={{ href: null }} />
            <Tabs.Screen name="CostumeManagement" options={{ href: null }} />

            <Tabs.Screen name="Profiles/Gilet_profile" options={{ href: null }} />
            <Tabs.Screen name="Profiles/Pantalon_profile" options={{ href: null }} />
            <Tabs.Screen name="Profiles/Veste_profile" options={{ href: null }} />
            <Tabs.Screen name="Profiles/Costume_profile" options={{ href: null }} />




            <Tabs.Screen name="Profiles/Create/CreateCostume" options={{ href: null }} />
            <Tabs.Screen name="Profiles/Create/CreateGilet" options={{ href: null }} />
            <Tabs.Screen name="Profiles/Create/CreatePantalon" options={{ href: null }} />
            <Tabs.Screen name="Profiles/Create/CreateVeste" options={{ href: null }} />

            {/* Hiding index and Booking */}
            <Tabs.Screen name="Profiles/index" options={{ href: null }} />
            <Tabs.Screen name="Booking/AppointmentBooking" options={{ href: null }} />
            <Tabs.Screen name="Profiles/MyMeasurements" options={{ href: null }} />


            <Tabs.Screen name="Profiles/VesteDetails" options={{ href: null }} />
            <Tabs.Screen name="Profiles/PantalonDetails" options={{ href: null }} />
            <Tabs.Screen name="Profiles/GiletDetails" options={{ href: null }} />
            <Tabs.Screen name="Profiles/CostumeDetails" options={{ href: null }} />



        </Tabs>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: "#ffffff",
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        paddingTop: 10,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    }
});