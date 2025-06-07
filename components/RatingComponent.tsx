import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

interface RatingComponentProps {
  rating: number;
  setRating: (rating: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ rating, setRating }) => {
  return (
    <View style={tw`flex-row mb-2`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text style={tw`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingComponent;