import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import tw from 'twrnc';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error('AuthContext must be used within AuthProvider');
  const { register } = authContext;

  const handleRegister = async () => {
    try {
      await register(email, password, name);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-4`}>
      <Text style={tw`text-2xl mb-4`}>Register</Text>
      <TextInput
        style={tw`border p-2 mb-4`}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Register" onPress={handleRegister} />
      <Text
        style={tw`text-blue-500 text-center mt-4`}
        onPress={() => router.push('/login')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

export default RegisterScreen;