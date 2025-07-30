// screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {LoginService} from "../../services/api/AuthService.ts";
import Icon from "@react-native-vector-icons/material-design-icons";
import {useAuth} from "../../app/AuthContext.tsx"; // 占位图标

const LoginScreen = () => {
    const navigation = useNavigation();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const { setIsLoggedIn } = useAuth();

    const handleLogin = async () => {
        try {
            await LoginService.login({ identifier, password });
            setIsLoggedIn(true);
        } catch (e: any) {
            Alert.alert('Login Failed', e.message || 'Unknown error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back</Text>

            <TextInput
                style={styles.input}
                placeholder="Email or Username"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Login" onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>

            {/* Apple Sign-In Placeholder */}
            <TouchableOpacity style={styles.thirdParty}>
                <Icon name="apple" size={24} />
                <Text style={styles.thirdPartyText}>Continue with Apple</Text>
            </TouchableOpacity>

            {/* Google Sign-In Placeholder */}
            <TouchableOpacity style={styles.thirdParty}>
                <Icon name="google" size={24} color="#db4a39" />
                <Text style={styles.thirdPartyText}>Continue with Google</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 16, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8, borderRadius: 4 },
    link: { marginTop: 10, color: '#007AFF', textAlign: 'center' },
    thirdParty: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', marginTop: 12
    },
    thirdPartyText: { marginLeft: 8 }
});

export default LoginScreen;
