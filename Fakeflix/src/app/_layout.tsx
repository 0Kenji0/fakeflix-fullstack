import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ToastProvider>
  );
}