import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { AuthContext } from "../context/AuthContext";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("AuthContext must be used within AuthProvider");
  const { login } = authContext;

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-4`}>
      <Text style={tw`text-2xl mb-4`}>Login</Text>
      <TextInput
        style={tw`border p-2 mb-4`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={tw`border p-2 mb-4`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={tw`text-blue-500 text-center mt-4`}
        onPress={() => router.push("/register" as any)}
      >
        Don`t have an account? Register
      </Text>
    </View>
  );
};

export default LoginScreen;
