import {request} from "../../utils/request.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

interface LoginRequest {
    identifier: string; // 用户名或邮箱
    password: string;
}

export const LoginService = {
    register: async (data: RegisterRequest) => {
        return request('/api/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async ({ identifier, password }: LoginRequest): Promise<string> => {
        const isEmail = identifier.includes('@');

        const payload = {
            username: isEmail ? null : identifier,
            email: isEmail ? identifier : null,
            password,
        };

        const response = await request('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (response.code !== '0000') {
            throw new Error(response.info);
        }

        const token = response.data?.token;
        if (!token) throw new Error('Missing token');

        await AsyncStorage.setItem('token', token);
        return token;
    },

    getProfile: async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        const response = await request('/api/v1/auth/info', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.code !== '0000') {
            throw new Error(response.info || 'Failed to load profile');
        }

        return response.data;
    },
};
