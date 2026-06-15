import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  // Edit profile
  const [username, setUsername] = useState(user?.username || "");
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Change password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/profile" as any);
  };

  const saveProfile = async () => {
    setProfileError("");
    setProfileSuccess("");
    if (!username.trim()) {
      setProfileError("Tên người dùng không được để trống");
      return;
    }
    setProfileSaving(true);
    try {
      await api.put("/api/users/me", { username, imageUrl });
      setProfileSuccess("Cập nhật hồ sơ thành công!");
    } catch (e: any) {
      setProfileError(e?.response?.data?.error || "Cập nhật thất bại");
    } finally {
      setProfileSaving(false);
    }
  };

  const changePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }
    setPasswordSaving(true);
    try {
      await api.put("/api/users/me/password", { oldPassword, newPassword });
      setPasswordSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      setPasswordError(e?.response?.data?.error || "Mật khẩu cũ không đúng");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Cài đặt"}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sửa hồ sơ */}
        <Text style={styles.sectionLabel}>{"HỒ SƠ"}</Text>
        <View style={styles.card}>
          {!!profileSuccess && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{profileSuccess}</Text>
            </View>
          )}
          {!!profileError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{profileError}</Text>
            </View>
          )}
          <Text style={styles.label}>{"Tên người dùng"}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setProfileError("");
              setProfileSuccess("");
            }}
            placeholder="Nhập tên người dùng"
            placeholderTextColor="#555"
          />
          <Text style={styles.label}>{"Avatar URL"}</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(t) => {
              setImageUrl(t);
              setProfileError("");
              setProfileSuccess("");
            }}
            placeholder="https://..."
            placeholderTextColor="#555"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.saveBtn, profileSaving && styles.saveBtnDisabled]}
            onPress={saveProfile}
            disabled={profileSaving}
          >
            {profileSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>{"Lưu thay đổi"}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Đổi mật khẩu */}
        <Text style={styles.sectionLabel}>{"MẬT KHẨU"}</Text>
        <View style={styles.card}>
          {!!passwordSuccess && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{passwordSuccess}</Text>
            </View>
          )}
          {!!passwordError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{passwordError}</Text>
            </View>
          )}
          <Text style={styles.label}>{"Mật khẩu hiện tại"}</Text>
          <TextInput
            style={styles.input}
            value={oldPassword}
            onChangeText={(t) => {
              setOldPassword(t);
              setPasswordError("");
              setPasswordSuccess("");
            }}
            placeholder="Nhập mật khẩu hiện tại"
            placeholderTextColor="#555"
            secureTextEntry
          />
          <Text style={styles.label}>{"Mật khẩu mới"}</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={(t) => {
              setNewPassword(t);
              setPasswordError("");
              setPasswordSuccess("");
            }}
            placeholder="Ít nhất 6 ký tự"
            placeholderTextColor="#555"
            secureTextEntry
          />
          <Text style={styles.label}>{"Xác nhận mật khẩu mới"}</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setPasswordError("");
              setPasswordSuccess("");
            }}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="#555"
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.saveBtn, passwordSaving && styles.saveBtnDisabled]}
            onPress={changePassword}
            disabled={passwordSaving}
          >
            {passwordSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>{"Đổi mật khẩu"}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  sectionLabel: {
    color: "#E50914",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#1f1f1f",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  label: { color: "#888", fontSize: 12, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  successBox: {
    backgroundColor: "rgba(46,204,113,0.15)",
    borderWidth: 1,
    borderColor: "#2ecc71",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  successText: { color: "#2ecc71", fontSize: 13, textAlign: "center" },
  errorBox: {
    backgroundColor: "rgba(229,9,20,0.15)",
    borderWidth: 1,
    borderColor: "#E50914",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: { color: "#E50914", fontSize: 13, textAlign: "center" },
});
