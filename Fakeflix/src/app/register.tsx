import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>{"FAKEFLIX"}</Text>

        <View style={styles.card}>
          <Text style={styles.title}>{"Tạo tài khoản"}</Text>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>{"Tên người dùng"}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setError("");
            }}
            placeholder="Nhập tên người dùng"
            placeholderTextColor="#555"
            autoCapitalize="none"
          />

          <Text style={styles.label}>{"Email"}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError("");
            }}
            placeholder="email@example.com"
            placeholderTextColor="#555"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>{"Mật khẩu"}</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError("");
              }}
              placeholder="Ít nhất 6 ký tự"
              placeholderTextColor="#555"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{"Xác nhận mật khẩu"}</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setError("");
            }}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#555"
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>{"Đăng ký"}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{"Đã có tài khoản? "}</Text>
            <Link href={"/login" as any} asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>{"Đăng nhập"}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  logo: {
    color: "#E50914",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },
  label: { color: "#888", fontSize: 12, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  passwordInput: {
    flex: 1,
    color: "#fff",
    padding: 12,
    fontSize: 14,
  },
  eyeBtn: { paddingHorizontal: 12 },
  submitBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { color: "#888", fontSize: 13 },
  footerLink: { color: "#E50914", fontSize: 13, fontWeight: "700" },
  errorBox: {
    backgroundColor: "rgba(229,9,20,0.15)",
    borderWidth: 1,
    borderColor: "#E50914",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  errorText: { color: "#E50914", fontSize: 13, textAlign: "center" },
});