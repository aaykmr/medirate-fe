import { getDoctors } from "@/src/services/doctors";
import { getHospitals } from "@/src/services/hospitals";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Doctor } from "../../src/interfaces/Doctor";
import { Hospital } from "../../src/interfaces/Hospital";

const HomeScreen: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalData = await getHospitals();
        const doctorData = await getDoctors();
        setHospitals(hospitalData);
        setDoctors(doctorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({
    item,
    type,
  }: {
    item: Hospital | Doctor;
    type: "Hospital" | "Doctor";
  }) => (
    <TouchableOpacity
      style={tw`p-4 border-b`}
      onPress={() => router.push(`/${type.toLowerCase()}/${item.id}` as any)}
    >
      <Text style={tw`text-lg`}>{item.name}</Text>
      <Text>Rating: {item.averageRating.toFixed(1)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl mb-4`}>Hospitals</Text>
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem({ item, type: "Hospital" })}
      />
      <Text style={tw`text-2xl mb-4 mt-4`}>Doctors</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem({ item, type: "Doctor" })}
      />
    </View>
  );
};

export default HomeScreen;
