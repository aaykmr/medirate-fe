import { Hospital } from "@/src/interfaces/Hospital";
import {
  createDoctor,
  CreateDoctorData,
  updateDoctor,
} from "@/src/services/doctors";
import { getHospitals } from "@/src/services/hospitals";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import tw from "twrnc";

interface DoctorFormProps {
  doctorId?: string;
  initialData?: CreateDoctorData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  doctorId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [specialty, setSpecialty] = useState(initialData?.specialty || "");
  const [hospitalId, setHospitalId] = useState(initialData?.hospitalId || "");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load hospitals");
      }
    };
    loadHospitals();
  }, []);

  const handleSubmit = async () => {
    if (!name || !specialty || !hospitalId) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (doctorId) {
        await updateDoctor(doctorId, { name, specialty, hospitalId });
      } else {
        await createDoctor({ name, specialty, hospitalId });
      }
      onSuccess?.();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`p-4`}>
      <TextInput
        style={tw`border p-2 mb-4 rounded-lg`}
        placeholder="Doctor Name"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />
      <TextInput
        style={tw`border p-2 mb-4 rounded-lg`}
        placeholder="Specialty"
        value={specialty}
        onChangeText={setSpecialty}
        editable={!isLoading}
      />
      <View style={tw`border p-2 mb-4 rounded-lg`}>
        <Picker
          selectedValue={hospitalId}
          onValueChange={(value: string) => setHospitalId(value)}
          enabled={!isLoading}
        >
          <Picker.Item label="Select a hospital" value="" />
          {hospitals.map((hospital) => (
            <Picker.Item
              key={hospital.id}
              label={hospital.name}
              value={hospital.id}
            />
          ))}
        </Picker>
      </View>
      <View style={tw`flex-row justify-end space-x-2`}>
        {onCancel && (
          <Button title="Cancel" onPress={onCancel} disabled={isLoading} />
        )}
        <Button
          title={doctorId ? "Update" : "Create"}
          onPress={handleSubmit}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default DoctorForm;
