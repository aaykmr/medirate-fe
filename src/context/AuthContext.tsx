import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../interfaces/User";
import { getUser, login, register } from "../services/users";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userLogin: (email: string, password: string) => Promise<void>;
  userRegister: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  userLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Loading user...");
        const token = await AsyncStorage.getItem("token");
        console.log("Token from storage:", token ? "exists" : "not found");

        if (!token) {
          console.log("No token found, skipping user load");
          setLoading(false);
          return;
        }

        console.log("Fetching user data...");
        try {
          const userData = await getUser();
          console.log("User data received:", userData ? "success" : "empty");
          setUser(userData);
        } catch (error) {
          console.error("Error loading user:", error);
          // Only clear token if it's an authentication error (401)
          if (error instanceof Error && error.message.includes("401")) {
            console.log("Authentication error, clearing token");
            await AsyncStorage.removeItem("token");
            setUser(null);
          } else {
            // For other errors (like 404), keep the token but set user to null
            console.log("Non-auth error, keeping token");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error in loadUser:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const userLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting login...");
      const response = await login(email, password);
      console.log("Login successful, storing token");
      await AsyncStorage.setItem("token", response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const userRegister = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      console.log("Attempting registration...");
      const response = await register(email, password, name);
      console.log("Registration successful, storing token");
      await AsyncStorage.setItem("token", response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const userLogout = async () => {
    try {
      console.log("Logging out...");
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, userLogin, userRegister, userLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
