import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

type Field = "username" | "email" | "password" | "confirm" | null;

function getPasswordStrength(password: string): {
  label: string;
  color: string;
  ratio: number;
} {
  if (!password) return { label: "", color: "#333", ratio: 0 };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Yếu", color: "#E50914", ratio: 0.33 };
  if (score <= 2) return { label: "Trung bình", color: "#f5a623", ratio: 0.66 };
  return { label: "Mạnh", color: "#2ecc71", ratio: 1 };
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<Field>(null);

  const scale = useRef(new Animated.Value(1)).current;
  const strength = useMemo(() => getPasswordStrength(password), [password]);

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

  const handleRegister = async () => {
    setError("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      toast.success("Tạo tài khoản thành công", "Chào mừng bạn đến Fakeflix!");
      router.replace("/(tabs)" as any);
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        "Không thể tạo tài khoản, vui lòng thử lại";
      setError(message);
      toast.error("Đăng ký thất bại", message);
    } finally {
      setSubmitting(false);
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
              <Text style={styles.title}>{"Tạo tài khoản"}</Text>
              <Text style={styles.subtitle}>
                {"Bắt đầu hành trình giải trí của bạn"}
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
                  focusedField === "username" && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={(t) => {
                    setUsername(t);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tên người dùng"
                  placeholderTextColor="#8c8c8c"
                  autoCapitalize="none"
                />
              </View>

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
                  placeholder="Mật khẩu (ít nhất 6 ký tự)"
                  placeholderTextColor="#8c8c8c"
                  secureTextEntry={!showPassword}
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

              {!!password && (
                <View style={styles.strengthWrap}>
                  <View style={styles.strengthTrack}>
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          width: `${strength.ratio * 100}%`,
                          backgroundColor: strength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.inputWrap,
                  focusedField === "confirm" && styles.inputWrapFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("confirm")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#8c8c8c"
                  secureTextEntry={!showPassword}
                />
              </View>

              <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    submitting && styles.submitBtnDisabled,
                  ]}
                  onPress={handleRegister}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  disabled={submitting}
                  activeOpacity={0.9}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>{"Đăng ký"}</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>{"Đã có tài khoản? "}</Text>
                <Link href={"/login" as any} asChild>
                  <TouchableOpacity hitSlop={8}>
                    <Text style={styles.footerLink}>{"Đăng nhập"}</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            <Text style={styles.disclaimer}>
              {
                "Bằng việc đăng ký, bạn đồng ý với các điều khoản sử dụng của Fakeflix."
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
  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -6,
    marginBottom: 14,
    gap: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  strengthFill: { height: "100%", borderRadius: 2 },
  strengthLabel: { fontSize: 11.5, fontWeight: "700", width: 72 },
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
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
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