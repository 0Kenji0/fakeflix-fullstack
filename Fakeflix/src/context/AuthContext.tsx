import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
  imageUrl: string | null;
  roles: string[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    otp: string,
  ) => Promise<void>;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      }
    } catch (e) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { accessToken, refreshToken } = res.data;
    await AsyncStorage.setItem("token", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    const me = await api.get("/api/auth/me");
    setUser(me.data);
  };

  const sendOtp = async (email: string) => {
    await api.post("/api/auth/send-otp", { email });
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    otp: string,
  ) => {
    const res = await api.post("/api/auth/register", {
      username,
      email,
      password,
      otp,
    });
    const { accessToken, refreshToken } = res.data;
    await AsyncStorage.setItem("token", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    const me = await api.get("/api/auth/me");
    setUser(me.data);
  };

  // Dùng khi nhận token thật từ redirect Google OAuth (xem app/oauth-callback.tsx)
  const loginWithTokens = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem("token", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    const me = await api.get("/api/auth/me");
    setUser(me.data);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {}
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        sendOtp,
        register,
        loginWithTokens,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);