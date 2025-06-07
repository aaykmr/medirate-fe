import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { deleteDoctor, getDoctors, type Doctor } from "../app/services/api";

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this doctor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoctor(id);
              await loadDoctors();
            } catch (error) {
              Alert.alert("Error", "Failed to delete doctor");
            }
          },
        },
      ]
    );
  };

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={tw`p-4 border-b border-gray-200`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <TouchableOpacity
          onPress={() => router.push(`/doctor/${item._id}`)}
          style={tw`flex-1`}
        >
          <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
          <Text style={tw`text-gray-600`}>{item.specialty}</Text>
          {item.hospital && (
            <Text style={tw`text-gray-500`}>
              Hospital: {item.hospital.name}
            </Text>
          )}
          <Text style={tw`text-blue-500`}>
            Rating: {item.averageRating.toFixed(1)}/5
          </Text>
        </TouchableOpacity>
        <View style={tw`flex-row space-x-2`}>
          <TouchableOpacity
            onPress={() => router.push(`/doctor/${item._id}/edit`)}
            style={tw`bg-blue-500 px-3 py-1 rounded`}
          >
            <Text style={tw`text-white`}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            style={tw`bg-red-500 px-3 py-1 rounded`}
          >
            <Text style={tw`text-white`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item._id}
        refreshing={isLoading}
        onRefresh={loadDoctors}
      />
      <TouchableOpacity
        onPress={() => router.push("/doctor/new")}
        style={tw`absolute bottom-4 right-4 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg`}
      >
        <Text style={tw`text-white text-3xl`}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorList;
