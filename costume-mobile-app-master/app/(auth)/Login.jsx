import {
    StyleSheet,
    TextInput,
    useColorScheme,
    View,
    ImageBackground,
    Pressable,
    Alert,
    Image
} from 'react-native'
import React, { useEffect, useState } from 'react';
import { colors } from "../../Constants/Colors";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/Themedtext";
import { Link, useRouter } from "expo-router";
import authService from "../../Services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme]
    const router = useRouter()
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const { user, loading } = useAuth();

    useEffect(() => {
        // When already authenticated, skip login screen
        if (!loading && user) {
            router.replace("/MainApplication/Main");
        }
    }, [user, loading]);

    const handleInputChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        setSubmitting(true);
        try {
            await authService.login({
                email: form.email,
                password: form.password
            });

            router.push("/MainApplication/Main");

        } catch (error) {
            console.log('Erreur', error.message || 'Erreur de connexion');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.background}>
            <Image
                source={require('../../assets/background.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <ThemedText type='title' style={{ color: '#D32F2F' }}>Sign in</ThemedText>

                    <Spacer height={20} />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        value={form.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!submitting}
                    />

                    <Spacer height={15} />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        editable={!submitting}
                    />

                    <Spacer height={20} />

                    <View style={styles.signupContainer}>
                        <ThemedText type="util" style={{ color: "#D32F2F" }}>
                            You don't have an account ? Signup
                        </ThemedText>
                        <Link href="/Signup" asChild>
                            <Pressable>
                                <ThemedText type="util" style={{ textDecorationLine: 'underline', marginLeft: 5, color: "#D32F2F" }}>
                                    here
                                </ThemedText>
                            </Pressable>
                        </Link>
                    </View>

                    <Spacer height={20} />

                    <View>
                        <Pressable
                            style={[
                                styles.button,
                                submitting && styles.buttonDisabled
                            ]}
                            onPress={handleLogin}
                            disabled={submitting}
                        >
                            <ThemedText style={styles.buttonText}>
                                {submitting ? 'Connexion...' : 'Login'}
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#ffffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 20
    },
    container: {
        width: '100%',
        alignItems: 'center',
        padding: 16,
    },
    formContainer: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#c8c8c8ff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ffffffff'
    },
    input: {
        borderWidth: 1,
        borderColor: '#c0c0c0ff',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        backgroundColor: '#ffffffff',
        color: '#000000ff'
    },
    button: {
        backgroundColor: '#D32F2F',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#ffffffff',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6
    },
    buttonDisabled: {
        backgroundColor: '#d2d2d2ff',
        opacity: 0.6,
    },
    buttonText: {
        color: '#000000ff',
        fontWeight: '800',
        fontSize: 16,
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
})