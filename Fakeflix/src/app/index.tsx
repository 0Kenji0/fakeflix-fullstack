import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/login" as any);
      }
    }
  }, [token, isLoading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#141414",
      }}
    >
      <ActivityIndicator size="large" color="#E50914" />
    </View>
  );
}
