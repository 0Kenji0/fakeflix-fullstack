import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [slowHint, setSlowHint] = useState(false);

  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
      if (slowTimer.current) clearTimeout(slowTimer.current);
    };
  }, []);

  const validateField = (
    field: string,
    value: string,
    currentPassword?: string,
  ) => {
    let msg = "";
    if (field === "username") {
      if (value.length > 0 && value.length < 6) msg = "Tối thiểu 6 ký tự";
    }
    if (field === "email") {
      if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        msg = "Email không hợp lệ";
    }
    if (field === "password") {
      if (value.length > 0 && value.length < 6) msg = "Tối thiểu 6 ký tự";
    }
    if (field === "confirmPassword") {
      const pwd = currentPassword ?? password;
      if (value.length > 0 && value !== pwd) msg = "Mật khẩu không khớp";
    }
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setSlowHint(false);

    if (!username || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (username.length < 6) {
      setError("Tên người dùng phải có ít nhất 6 ký tự");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
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

    setLoading(true);
    slowTimer.current = setTimeout(() => setSlowHint(true), 5000);

    try {
      await register(username, email, password);
      setSlowHint(false);
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      redirectTimer.current = setTimeout(() => {
        router.replace("/(tabs)" as any);
      }, 1000);
    } catch (e: unknown) {
      setSlowHint(false);
      const err = e as {
        response?: {
          data?: { error?: string; message?: string };
          status?: number;
        };
        code?: string;
      };
      if (err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
        setError("Server đang khởi động, vui lòng thử lại sau 30 giây");
      } else if (err.response?.status === 409) {
        setError("Email hoặc tên người dùng đã tồn tại");
      } else {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Đăng ký thất bại, thử lại",
        );
      }
    } finally {
      if (slowTimer.current) clearTimeout(slowTimer.current);
      setLoading(false);
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
          <Text style={styles.title}>{"Đăng ký"}</Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!!success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          <TextInput
            style={[styles.input, !!errors.username && styles.inputError]}
            placeholder="Tên người dùng (tối thiểu 6 ký tự)"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              validateField("username", t);
              setError("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          {!!errors.username && (
            <Text style={styles.fieldError}>{errors.username}</Text>
          )}

          <TextInput
            style={[styles.input, !!errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              validateField("email", t);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          {!!errors.email && (
            <Text style={styles.fieldError}>{errors.email}</Text>
          )}

          <TextInput
            style={[styles.input, !!errors.password && styles.inputError]}
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              validateField("password", t);
              if (confirmPassword.length > 0) {
                validateField("confirmPassword", confirmPassword, t);
              }
              setError("");
            }}
            secureTextEntry
            editable={!loading}
          />
          {!!errors.password && (
            <Text style={styles.fieldError}>{errors.password}</Text>
          )}

          <TextInput
            style={[
              styles.input,
              !!errors.confirmPassword && styles.inputError,
            ]}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              validateField("confirmPassword", t);
              setError("");
            }}
            secureTextEntry
            editable={!loading}
          />
          {!!errors.confirmPassword && (
            <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loadingText}>
                  {slowHint ? "Đang khởi động server..." : "Đang xử lý..."}
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>{"Đăng ký"}</Text>
            )}
          </TouchableOpacity>

          {slowHint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                {
                  "⏳ Server đang khởi động (free tier), vui lòng chờ khoảng 1-2 phút..."
                }
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.push("/login" as any)}
            disabled={loading}
          >
            <Text style={styles.link}>
              {"Đã có tài khoản? "}
              <Text style={styles.linkBold}>{"Đăng nhập"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#E50914",
    letterSpacing: 4,
    marginBottom: 40,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 12,
    padding: 32,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  errorBox: {
    backgroundColor: "rgba(229,9,20,0.15)",
    borderWidth: 1,
    borderColor: "#E50914",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: { color: "#E50914", fontSize: 13, textAlign: "center" },
  successBox: {
    backgroundColor: "rgba(0,200,0,0.15)",
    borderWidth: 1,
    borderColor: "#00c800",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  successText: { color: "#00c800", fontSize: 13, textAlign: "center" },
  hintBox: {
    backgroundColor: "rgba(255,165,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.4)",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  hintText: {
    color: "#ffb347",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  fieldError: {
    color: "#E50914",
    fontSize: 11,
    marginBottom: 6,
    marginTop: -2,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 6,
    padding: 16,
    marginBottom: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
  },
  inputError: { borderColor: "#E50914" },
  button: {
    backgroundColor: "#E50914",
    borderRadius: 6,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadingText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  link: { color: "#aaa", textAlign: "center", fontSize: 14, marginTop: 4 },
  linkBold: { color: "#fff", fontWeight: "bold" },
});
