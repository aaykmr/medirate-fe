import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http:////localhost:5001/api"; // Replace with your backend URL

interface User {
  id: string;
  email: string;
  name: string;
}

interface Hospital {
  _id: string;
  name: string;
  address: string;
  averageRating: number;
  reviews: Review[];
}

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  hospital?: Hospital;
  averageRating: number;
  reviews: Review[];
}

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  hospital?: string;
  doctor?: string;
  createdAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const fetchWithToken = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await AsyncStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  return response.json();
};

export const login = (email: string, password: string): Promise<AuthResponse> =>
  fetchWithToken("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> =>
  fetchWithToken("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

export const getUser = (token: string): Promise<User> =>
  fetchWithToken("/auth/user", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getHospitals = (): Promise<Hospital[]> =>
  fetchWithToken("/hospitals");
export const getHospital = (id: string): Promise<Hospital> =>
  fetchWithToken(`/hospitals/${id}`);
export const submitHospitalReview = (
  id: string,
  review: { rating: number; comment: string }
): Promise<Review> =>
  fetchWithToken(`/hospitals/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

export const getDoctors = (): Promise<Doctor[]> => fetchWithToken("/doctors");
export const getDoctor = (id: string): Promise<Doctor> =>
  fetchWithToken(`/doctors/${id}`);
export const submitDoctorReview = (
  id: string,
  review: { rating: number; comment: string }
): Promise<Review> =>
  fetchWithToken(`/doctors/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

export type { Doctor, Hospital, Review, User };
