import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import {
  deleteHospital,
  getHospitals,
  type Hospital,
} from "../app/services/api";

const HospitalList: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHospitals = async () => {
    setIsLoading(true);
    try {
      const data = await getHospitals();
      setHospitals(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load hospitals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this hospital?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHospital(id);
              await loadHospitals();
            } catch (error) {
              Alert.alert("Error", "Failed to delete hospital");
            }
          },
        },
      ]
    );
  };

  const renderHospital = ({ item }: { item: Hospital }) => (
    <View style={tw`p-4 border-b border-gray-200`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <TouchableOpacity
          onPress={() => router.push(`/hospital/${item._id}`)}
          style={tw`flex-1`}
        >
          <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
          <Text style={tw`text-gray-600`}>{item.address}</Text>
          <Text style={tw`text-blue-500`}>
            Rating: {item.averageRating.toFixed(1)}/5
          </Text>
        </TouchableOpacity>
        <View style={tw`flex-row space-x-2`}>
          <TouchableOpacity
            onPress={() => router.push(`/hospital/${item._id}/edit`)}
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
      {item.doctors && item.doctors.length > 0 && (
        <View style={tw`mt-2`}>
          <Text style={tw`font-semibold mb-1`}>Doctors:</Text>
          {item.doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor._id}
              onPress={() => router.push(`/doctor/${doctor._id}`)}
              style={tw`ml-2 mb-1`}
            >
              <Text style={tw`text-gray-700`}>
                {doctor.name} - {doctor.specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={hospitals}
        renderItem={renderHospital}
        keyExtractor={(item) => item._id}
        refreshing={isLoading}
        onRefresh={loadHospitals}
      />
      <TouchableOpacity
        onPress={() => router.push("/hospital/new")}
        style={tw`absolute bottom-4 right-4 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg`}
      >
        <Text style={tw`text-white text-3xl`}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HospitalList;
