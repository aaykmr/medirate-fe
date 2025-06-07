import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// This component handles the authentication state and redirects accordingly
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup =
      segments[0] === "screens" &&
      (segments[1] === "LoginScreen" || segments[1] === "RegisterScreen");

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace("/screens/LoginScreen");
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  if (loading) {
    return null; // Or a loading screen
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
    </AuthProvider>
  );
}
