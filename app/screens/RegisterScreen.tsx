import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { useAuth } from "../../src/context/AuthContext";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <View style={tw`flex-1 p-4 justify-center`}>
      <Text style={tw`text-2xl mb-4 text-center`}>Register</Text>
      {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}
      <TextInput
        style={tw`border p-2 mb-2`}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={tw`border p-2 mb-2`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={tw`border p-2 mb-4`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => router.replace("/screens/LoginScreen")}
      />
    </View>
  );
};

export default RegisterScreen;
