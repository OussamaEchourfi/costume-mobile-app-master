import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../Constants/Colors";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme]
    console.log(colorScheme)

    return (
        <Tabs>
            <Tabs.Screen
                name="Login"  // Majuscule
                options={{
                    title: "Login",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? "log-in" : "log-in-outline"}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="Signup"  // Majuscule
                options={{
                    title: "Sign Up",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? "person-add" : "person-add-outline"}
                            size={size}
                            color={color}
                        />

                    )
                }}

            />

        </Tabs>
    );
}