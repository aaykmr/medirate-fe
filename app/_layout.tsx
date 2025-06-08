import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

// This component handles the authentication state and redirects accordingly
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "screens";
    const inTabsGroup = segments[0] === "(tabs)";

    // If we're in the auth group (login/register) and have a user, go to home
    if (user && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }

    // If we're not in auth group and don't have a user, go to login
    if (!user && !inAuthGroup && !loading) {
      router.replace("/screens/LoginScreen");
      return;
    }
  }, [user, loading, segments]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack>
          <Stack.Screen
            name="screens/LoginScreen"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="screens/RegisterScreen"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="hospital/[id]"
            options={{ title: "Hospital Details" }}
          />
          <Stack.Screen
            name="doctor/[id]"
            options={{ title: "Doctor Details" }}
          />
        </Stack>
      </AuthGuard>
      <Toast />
    </AuthProvider>
  );
}
