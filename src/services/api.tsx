import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://localhost:5001/api"; // Updated to match Postman collection

export const fetchWithToken = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  console.log(`Making request to: ${url}`);
  const token = await AsyncStorage.getItem("token");
  console.log("Token for request:", token ? "exists" : "not found");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  console.log("Request headers:", headers);
  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  console.log("Response status:", response.status);

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error("API error:", {
      status: response.status,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log("Response data:", data ? "received" : "empty");
  return data;
};
