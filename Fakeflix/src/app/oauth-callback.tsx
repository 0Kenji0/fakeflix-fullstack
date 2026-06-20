import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function OAuthCallbackScreen() {
  const { accessToken, refreshToken, error } = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }>();
  const { loginWithTokens } = useAuth();
  const toast = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const run = async () => {
      if (error) {
        toast.error("Đăng nhập Google thất bại", "Vui lòng thử lại");
        router.replace("/login" as any);
        return;
      }

      if (!accessToken || !refreshToken) {
        toast.error("Đăng nhập Google thất bại", "Thiếu thông tin xác thực");
        router.replace("/login" as any);
        return;
      }

      try {
        await loginWithTokens(accessToken, refreshToken);
        toast.success("Đăng nhập thành công", "Chào mừng bạn đến Fakeflix!");
        router.replace("/(tabs)" as any);
      } catch (e) {
        toast.error("Đăng nhập Google thất bại", "Vui lòng thử lại");
        router.replace("/login" as any);
      }
    };

    run();
  }, [accessToken, refreshToken, error]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E50914" />
      <Text style={styles.text}>{"Đang đăng nhập..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  text: { color: "#9a9a9a", fontSize: 14 },
});