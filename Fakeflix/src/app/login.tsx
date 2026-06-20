import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      speed: 30,
    }).start();

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Đăng nhập thành công", "Chào mừng bạn trở lại!");
      router.replace("/(tabs)" as any);
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        "Email hoặc mật khẩu không đúng";
      setError(message);
      toast.error("Đăng nhập thất bại", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const url = `${BASE_URL}/oauth2/authorization/google`;
    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.55)",
          "rgba(10,10,10,0.88)",
          "rgba(5,5,5,0.97)",
          "#0a0a0a",
        ]}
        locations={[0, 0.45, 0.75, 1]}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoWrap}>
              <Text style={styles.logo}>{"FAKEFLIX"}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{"Đăng nhập"}</Text>
              <Text style={styles.subtitle}>
                {"Xem phim, show truyền hình không giới hạn"}
              </Text>

              {!!error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#ff6b6b" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View
                style={[
                  styles.inputWrap,
                  focusedField === "email" && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email"
                  placeholderTextColor="#8c8c8c"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View
                style={[
                  styles.inputWrap,
                  styles.passwordRow,
                  focusedField === "password" && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#8c8c8c"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={19}
                    color="#a0a0a0"
                  />
                </TouchableOpacity>
              </View>

              <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    submitting && styles.submitBtnDisabled,
                  ]}
                  onPress={handleLogin}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  disabled={submitting}
                  activeOpacity={0.9}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>{"Đăng nhập"}</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{"hoặc"}</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleLogin}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-google" size={18} color="#fff" />
                <Text style={styles.googleBtnText}>
                  {"Tiếp tục với Google"}
                </Text>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>{"Chưa có tài khoản? "}</Text>
                <Link href={"/register" as any} asChild>
                  <TouchableOpacity hitSlop={8}>
                    <Text style={styles.footerLink}>{"Đăng ký ngay"}</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            <Text style={styles.disclaimer}>
              {
                "Trang này được bảo vệ. Thông tin của bạn được mã hoá và không chia sẻ cho bên thứ ba."
              }
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  logoWrap: { marginBottom: 28, alignItems: "center" },
  logo: {
    color: "#E50914",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 3,
    textShadowColor: "rgba(229,9,20,0.55)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(20,20,20,0.86)",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#9a9a9a",
    fontSize: 13.5,
    marginBottom: 22,
  },
  inputWrap: {
    backgroundColor: "rgba(51,51,51,0.7)",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
    marginBottom: 14,
  },
  inputWrapFocused: {
    borderColor: "#E50914",
    backgroundColor: "rgba(51,51,51,0.95)",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    color: "#fff",
    padding: 14,
    fontSize: 15,
  },
  passwordInput: { flex: 1 },
  eyeBtn: { paddingHorizontal: 14 },
  submitBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  dividerText: {
    color: "#666",
    fontSize: 12,
    marginHorizontal: 12,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    paddingVertical: 13,
  },
  googleBtnText: { color: "#fff", fontWeight: "600", fontSize: 14.5 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  footerText: { color: "#9a9a9a", fontSize: 14 },
  footerLink: { color: "#fff", fontSize: 14, fontWeight: "700" },
  disclaimer: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    maxWidth: 420,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(229,9,20,0.12)",
    borderWidth: 1,
    borderColor: "rgba(229,9,20,0.4)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#ff8585", fontSize: 13, flex: 1 },
});