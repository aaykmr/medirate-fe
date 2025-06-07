import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Implement Google SSO login logic here
      console.log("Google login initiated");
      // After successful login
      router.replace("/");
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-6 justify-center items-center bg-white`}>
      <View style={tw`w-full max-w-sm`}>
        {/* Logo */}
        <View style={tw`items-center mb-8`}>
          <Text style={tw`text-3xl font-bold text-blue-600 mb-2`}>
            MediRate
          </Text>
          <Text style={tw`text-gray-500 text-center`}>
            Find and rate the best hospitals and doctors
          </Text>
        </View>

        {/* SSO Buttons */}
        <View style={tw`space-y-4 w-full`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center bg-white border border-gray-300 rounded-lg p-3 shadow-sm`}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <FontAwesome
              name="google"
              size={20}
              color="#DB4437"
              style={tw`mr-3`}
            />
            <Text style={tw`text-gray-800 font-medium`}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading indicator */}
        {isLoading && (
          <View style={tw`mt-4 items-center`}>
            <ActivityIndicator size="small" color="#4285F4" />
          </View>
        )}

        {/* Terms and Privacy */}
        <Text style={tw`text-xs text-gray-500 text-center mt-8`}>
          By continuing, you agree to MediRate`s{" "}
          <Text style={tw`text-blue-600`}>Terms of Service</Text> and{" "}
          <Text style={tw`text-blue-600`}>Privacy Policy</Text>
        </Text>
      </View>

      {/* Skip for now option */}
      <TouchableOpacity style={tw`mt-8`} onPress={() => router.replace("/")}>
        <Text style={tw`text-blue-600 font-medium`}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
