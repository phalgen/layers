import { useEffect } from 'react';
import { Stack, router } from 'expo-router';

import { useAuth } from '@context';

const AuthLayout = () => {
    const { assessment, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && assessment) {
            router.replace('/home')
        } else if (isAuthenticated && !assessment) {
            router.replace('/assessments')
        }
    }, [isAuthenticated]);

    return (
        <Stack screenOptions={{ contentStyle: 
            { backgroundColor: '#FDF8FF'}
        }}>
            <Stack.Screen
                name="start"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="signIn"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="signUp"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="assessments"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
 
export default AuthLayout;
