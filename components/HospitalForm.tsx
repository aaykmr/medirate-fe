import React, { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import tw from "twrnc";
import {
  createHospital,
  updateHospital,
  type CreateHospitalData,
} from "../app/services/api";

interface HospitalFormProps {
  hospitalId?: string;
  initialData?: CreateHospitalData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const HospitalForm: React.FC<HospitalFormProps> = ({
  hospitalId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (hospitalId) {
        await updateHospital(hospitalId, { name, address });
      } else {
        await createHospital({ name, address });
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
        placeholder="Hospital Name"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />
      <TextInput
        style={tw`border p-2 mb-4 rounded-lg`}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        editable={!isLoading}
      />
      <View style={tw`flex-row justify-end space-x-2`}>
        {onCancel && (
          <Button title="Cancel" onPress={onCancel} disabled={isLoading} />
        )}
        <Button
          title={hospitalId ? "Update" : "Create"}
          onPress={handleSubmit}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default HospitalForm;
