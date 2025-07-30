import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {LoginService} from "../../services/api/AuthService.ts";

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await LoginService.register({ email, username, password });
            Alert.alert('Success', 'Registration complete!');
            navigation.navigate('Login' as never);
        } catch (e: any) {
            Alert.alert('Register Failed', e.message || 'Unknown error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 16, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8, borderRadius: 4 },
});

export default RegisterScreen;
