import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

export default function NotFound() {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-2xl`}>Page Not Found</Text>
    </View>
  );
}