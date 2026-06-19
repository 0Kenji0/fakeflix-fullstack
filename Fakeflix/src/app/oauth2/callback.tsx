import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function OAuth2CallbackScreen() {
  const params = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
  }>();
  const { setSession } = useAuth();
  const toast = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const run = async () => {
      const { accessToken, refreshToken } = params;

      if (!accessToken || !refreshToken) {
        toast.error("Đăng nhập Google thất bại", "Thiếu thông tin xác thực từ server");
        router.replace("/login" as any);
        return;
      }

      try {
        await setSession(accessToken, refreshToken);
        toast.success("Đăng nhập thành công!", "Chào mừng bạn đến với Fakeflix");
        router.replace("/(tabs)" as any);
      } catch (e) {
        toast.error("Đăng nhập Google thất bại", "Không thể tải thông tin tài khoản");
        router.replace("/login" as any);
      }
    };

    run();
  }, [params]);

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
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", marginTop: 16, fontSize: 15 },
});