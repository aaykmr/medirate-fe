import RatingComponent from "@/components/RatingComponent";
import React, { useContext, useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { AuthContext } from "../context/AuthContext";
import * as api from "../services/api";

const HospitalScreen = ({ route }: any) => {
  const { id } = route.params;
  const [hospital, setHospital] = useState<any>(null);
  const [rating, setRating] = useState<any>(0);
  const [comment, setComment] = useState<any>("");
  const { user } = useContext<any>(AuthContext);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const data = await api.getHospital(id);
        setHospital(data);
      } catch (error) {
        console.error("Error fetching hospital:", error);
      }
    };
    fetchHospital();
  }, [id]);

  const handleSubmitReview = async () => {
    try {
      await api.submitHospitalReview(id, { rating, comment });
      setRating(0);
      setComment("");
      const data = await api.getHospital(id);
      setHospital(data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!hospital) return <Text>Loading...</Text>;

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl mb-2`}>{hospital.name}</Text>
      <Text style={tw`mb-2`}>{hospital.address}</Text>
      <Text style={tw`mb-4`}>
        Average Rating: {hospital.averageRating.toFixed(1)}
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
        data={hospital.reviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
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

export default HospitalScreen;
