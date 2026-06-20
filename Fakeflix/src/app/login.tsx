import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLogin = async () => {
    setHasError(false);

    if (!email || !password) {
      setHasError(true);
      toast.error("Thiếu thông tin", "Vui lòng nhập email và mật khẩu");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setHasError(true);
      toast.error("Email không hợp lệ", "Vui lòng kiểm tra lại định dạng email");
      return;
    }
    if (password.length < 6) {
      setHasError(true);
      toast.error("Mật khẩu quá ngắn", "Phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công!", "Đang chuyển hướng...");
      setTimeout(() => router.replace("/(tabs)" as any), 1000);
    } catch (e: any) {
      setHasError(true);
      const msg = e?.response?.data?.error || "Email hoặc mật khẩu không đúng";
      toast.error("Đăng nhập thất bại", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (Platform.OS === "web") {
      window.location.href = "https://fakeflix-fullstack-1.onrender.com/oauth2/authorization/google";
    } else {
      toast.info("Chưa hỗ trợ", "Đăng nhập Google hiện chỉ khả dụng trên bản web");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.logo}>{"FAKEFLIX"}</Text>

        <View style={styles.box}>
          <Text style={styles.title}>{"Đăng nhập"}</Text>

          <TextInput
            style={[styles.input, hasError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(t) => { setEmail(t); setHasError(false); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, hasError && styles.inputError]}
            placeholder="Mật khẩu"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(t) => { setPassword(t); setHasError(false); }}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{"Đăng nhập"}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{"hoặc"}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Text style={styles.googleIcon}>{"G"}</Text>
            <Text style={styles.googleText}>{"Đăng nhập bằng Google"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register" as any)}>
            <Text style={styles.link}>
              {"Chưa có tài khoản? "}
              <Text style={styles.linkBold}>{"Đăng ký ngay"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.65)" },
  wrapper: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  logo: { fontSize: 42, fontWeight: "bold", color: "#E50914", letterSpacing: 4, marginBottom: 40, textShadowColor: "rgba(0,0,0,0.8)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
  box: { width: "100%", maxWidth: 400, backgroundColor: "rgba(0,0,0,0.75)", borderRadius: 12, padding: 32 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  input: { backgroundColor: "#333", color: "#fff", borderRadius: 6, padding: 16, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: "#555" },
  inputError: { borderColor: "#E50914" },
  button: { backgroundColor: "#E50914", borderRadius: 6, padding: 16, alignItems: "center", marginTop: 8, marginBottom: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#555" },
  dividerText: { color: "#aaa", fontSize: 13, marginHorizontal: 12 },
  googleButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 6, padding: 14, marginBottom: 16 },
  googleIcon: { color: "#E50914", fontSize: 18, fontWeight: "900", marginRight: 10 },
  googleText: { color: "#333", fontSize: 15, fontWeight: "600" },
  link: { color: "#aaa", textAlign: "center", fontSize: 14 },
  linkBold: { color: "#fff", fontWeight: "bold" },
});