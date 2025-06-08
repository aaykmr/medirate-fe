import { getDoctors } from "@/src/services/doctors";
import { getHospitals } from "@/src/services/hospitals";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import { Doctor } from "../../src/interfaces/Doctor";
import { Hospital } from "../../src/interfaces/Hospital";

const HomeScreen: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Toast.show({
          type: "error",
          text1: "Location Permission Denied",
          text2: "Please enable location access to see nearby hospitals",
        });
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Location Error",
          text2: "Could not get your current location",
        });
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalData = await getHospitals(
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                radius: 20, // 20km radius
              }
            : undefined
        );
        const doctorData = await getDoctors();
        setHospitals(hospitalData);
        setDoctors(doctorData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch hospitals and doctors",
        });
      }
    };
    fetchData();
  }, [location]);

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
      {errorMsg && <Text style={tw`text-red-500 mb-4`}>{errorMsg}</Text>}
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
