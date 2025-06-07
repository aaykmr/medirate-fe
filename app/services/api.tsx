import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5001/api"; // Updated to match Postman collection

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
  doctors?: Doctor[];
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

interface CreateHospitalData {
  name: string;
  address: string;
}

interface CreateDoctorData {
  name: string;
  specialty: string;
  hospitalId: string;
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
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Auth endpoints
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

// Hospital endpoints
export const getHospitals = (): Promise<Hospital[]> =>
  fetchWithToken("/hospitals");

export const getHospital = (id: string): Promise<Hospital> =>
  fetchWithToken(`/hospitals/${id}`);

export const createHospital = (data: CreateHospitalData): Promise<Hospital> =>
  fetchWithToken("/hospitals", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateHospital = (
  id: string,
  data: Partial<CreateHospitalData>
): Promise<Hospital> =>
  fetchWithToken(`/hospitals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteHospital = (id: string): Promise<void> =>
  fetchWithToken(`/hospitals/${id}`, {
    method: "DELETE",
  });

export const submitHospitalReview = (
  id: string,
  review: { rating: number; comment: string }
): Promise<Review> =>
  fetchWithToken(`/hospitals/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

// Doctor endpoints
export const getDoctors = (): Promise<Doctor[]> => fetchWithToken("/doctors");

export const getDoctor = (id: string): Promise<Doctor> =>
  fetchWithToken(`/doctors/${id}`);

export const createDoctor = (data: CreateDoctorData): Promise<Doctor> =>
  fetchWithToken("/doctors", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDoctor = (
  id: string,
  data: Partial<CreateDoctorData>
): Promise<Doctor> =>
  fetchWithToken(`/doctors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteDoctor = (id: string): Promise<void> =>
  fetchWithToken(`/doctors/${id}`, {
    method: "DELETE",
  });

export const submitDoctorReview = (
  id: string,
  review: { rating: number; comment: string }
): Promise<Review> =>
  fetchWithToken(`/doctors/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

export type {
  CreateDoctorData,
  CreateHospitalData,
  Doctor,
  Hospital,
  Review,
  User,
};
