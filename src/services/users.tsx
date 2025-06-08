import { User } from "../interfaces/User";
import { BASE_URL, fetchWithToken } from "./api";

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = (email: string, password: string): Promise<AuthResponse> =>
  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    return response.json();
  });

export const register = (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> =>
  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
    return response.json();
  });

export const getUser = (): Promise<User> => fetchWithToken("/users/profile");
