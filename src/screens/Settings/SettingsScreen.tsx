import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import {
    Avatar,
    Button,
    Text,
    ActivityIndicator,
    Divider,
    Title,
    Menu,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { LoginService } from '../../services/api/AuthService.ts';
import { useAuth } from '../../app/AuthContext.tsx';

export default function SettingScreen() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { setIsLoggedIn } = useAuth();

    const loadProfile = async () => {
        setLoading(true);
        try {
            const user = await LoginService.getProfile();
            setProfile(user);
        } catch (err: any) {
            if (err.message === 'Request failed') return;
            Alert.alert('Error', err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: 'red' }}>❌ Failed to load user info.</Text>
                <Button mode="contained" onPress={loadProfile} style={{ marginTop: 12 }}>
                    Retry
                </Button>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 用户资料 */}
            <View style={styles.profileHeader}>
                <Avatar.Icon size={64} icon="account" />
                <View style={{ marginLeft: 16 }}>
                    <Title>{profile.username}</Title>
                    <Text>{profile.email}</Text>
                    <Text style={styles.timestampText}>
                        Joined {format(new Date(profile.createdAt || profile.created_at), 'PPP')}
                    </Text>
                </View>
            </View>

            <Divider style={{ marginVertical: 20 }} />

            {/* 设置项 */}
            <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                ⚙️ Settings
            </Text>

            <View style={styles.menuWrapper}>
                <Menu.Item
                    onPress={() => {}}
                    title="Thermometer Management"
                    style={styles.menuItem}
                />
                <Menu.Item
                    onPress={() => {}}
                    title="Export My Data"
                    style={styles.menuItem}
                />
                <Menu.Item
                    onPress={() => {}}
                    title="Comfort Alerts"
                    style={styles.menuItem}
                />
            </View>

            <Divider style={{ marginVertical: 20 }} />

            <Button mode="contained-tonal" onPress={handleLogout} textColor="red">
                Logout
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestampText: {
        color: '#888',
        marginTop: 4,
    },
    menuWrapper: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
