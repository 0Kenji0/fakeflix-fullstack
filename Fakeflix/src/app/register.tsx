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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (username.length < 6) {
      setError("Tên người dùng phải có ít nhất 6 ký tự");
      return;
    }

    if (password.length < 5) {
      setError("Mật khẩu phải có ít nhất 5 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp, vui lòng thử lại");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      router.replace("/(tabs)" as any);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.email ||
        e?.response?.data?.username ||
        "Đăng ký thất bại, vui lòng thử lại";
      setError(msg);
    } finally {
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
        <Text style={styles.logo}>FAKEFLIX</Text>

        <View style={styles.box}>
          <Text style={styles.title}>Đăng ký</Text>

          {/* Hiện lỗi inline */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={[styles.input, !!error && styles.inputError]}
            placeholder="Tên người dùng"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setError("");
            }}
          />
          <TextInput
            style={[styles.input, !!error && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, !!error && styles.inputError]}
            placeholder="Mật khẩu"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError("");
            }}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, !!error && styles.inputError]}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setError("");
            }}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>
              {"Đã có tài khoản? "}
              <Text style={styles.linkBold}>Đăng nhập</Text>
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
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { color: "#aaa", textAlign: "center", fontSize: 14 },
  linkBold: { color: "#fff", fontWeight: "bold" },
});
