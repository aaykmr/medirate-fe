import RatingComponent from "@/components/RatingComponent";
import { getDoctor, submitDoctorReview } from "@/src/services/doctors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { useAuth } from "../../src/context/AuthContext";
import { Doctor } from "../../src/interfaces/Doctor";
import { Review } from "../../src/interfaces/Review";

const DoctorScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctor(id as string);
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleSubmitReview = async () => {
    try {
      await submitDoctorReview(id as string, { rating, comment });
      setRating(0);
      setComment("");
      const data = await getDoctor(id as string);
      setDoctor(data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!doctor) return <Text>Loading...</Text>;

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl mb-2`}>{doctor.name}</Text>
      <Text style={tw`mb-2`}>Specialty: {doctor.specialty}</Text>
      <Text style={tw`mb-4`}>Hospital: {doctor.hospital?.name}</Text>
      <Text style={tw`mb-4`}>
        Average Rating: {doctor.averageRating.toFixed(1)}
      </Text>
      {user && (
        <View style={tw`mb-4`}>
          <Text style={tw`mb-2`}>Your Review</Text>
          <RatingComponent rating={rating} setRating={setRating} />
          <TextInput
            style={tw`border p-2 mb-2`}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
          />
          <Button title="Submit Review" onPress={handleSubmitReview} />
        </View>
      )}
      <Text style={tw`text-xl mb-2`}>Reviews</Text>
      <FlatList
        data={doctor.reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Review }) => (
          <View style={tw`p-2 border-b`}>
            <Text>Rating: {item.rating}</Text>
            <Text>{item.comment}</Text>
            <Text style={tw`text-gray-500`}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default DoctorScreen;
