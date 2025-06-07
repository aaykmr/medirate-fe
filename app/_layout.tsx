import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="hospital/[id]" options={{ title: 'Hospital Details' }} />
        <Stack.Screen name="doctor/[id]" options={{ title: 'Doctor Details' }} />
      </Stack>
    </AuthProvider>
  );
}