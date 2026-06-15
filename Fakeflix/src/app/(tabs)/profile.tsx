import { router } from "expo-router";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChevronForwardIcon,
  HeartIcon,
  LogoutIcon,
  PersonIcon,
  SettingsIcon,
  ShieldIcon,
  TimeIcon,
} from "../../components/icons";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout, token } = useAuth();

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;
      await logout();
      router.replace("/login" as any);
    } else {
      const { Alert } = require("react-native");
      Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login" as any);
          },
        },
      ]);
    }
  };

  if (!token) {
    return (
      <View style={styles.center}>
        <PersonIcon size={80} color="#444" />
        <Text style={styles.msg}>{"Bạn chưa đăng nhập"}</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/login" as any)}
        >
          <Text style={styles.btnText}>{"Đăng nhập"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, Platform.OS === "web" && { paddingTop: 80 }]}>
        <Text style={styles.headerTitle}>{"Tài khoản"}</Text>
      </View>

      <View style={styles.profileCard}>
        {/* HIỂN THỊ ẢNH NẾU CÓ imageUrl, KHÔNG THÌ HIỆN CHỮ CÁI ĐẦU */}
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View
            style={[
              styles.roleBadge,
              user?.roles?.includes("ADMIN") ? styles.adminBadge : styles.userBadge,
            ]}
          >
            <ShieldIcon size={12} color="#fff" />
            <Text style={styles.roleText}>
              {user?.roles?.includes("ADMIN") ? "ADMIN" : "USER"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(tabs)/favorites" as any)}
        >
          <HeartIcon size={22} color="#ccc" />
          <Text style={styles.menuText}>{"Phim yêu thích"}</Text>
          <ChevronForwardIcon size={18} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(tabs)/history" as any)}
        >
          <TimeIcon size={22} color="#ccc" />
          <Text style={styles.menuText}>{"Lịch sử xem"}</Text>
          <ChevronForwardIcon size={18} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/settings" as any)}
        >
          <SettingsIcon size={22} color="#ccc" />
          <Text style={styles.menuText}>{"Cài đặt"}</Text>
          <ChevronForwardIcon size={18} color="#555" />
        </TouchableOpacity>

        {user?.roles?.includes("ADMIN") ? (
          <TouchableOpacity
            style={[styles.menuItem, styles.adminMenuItem]}
            onPress={() => router.push("/admin" as any)}
          >
            <ShieldIcon size={22} color="#E50914" />
            <Text style={[styles.menuText, { color: "#E50914" }]}>
              {"Admin Panel"}
            </Text>
            <ChevronForwardIcon size={18} color="#E50914" />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogoutIcon size={20} color="#E50914" />
        <Text style={styles.logoutText}>{"Đăng xuất"}</Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  center: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "#141414",
  },
  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: "#2a2a2a",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  profileCard: {
    flexDirection: "row", alignItems: "center",
    padding: 20, borderBottomWidth: 1, borderBottomColor: "#2a2a2a",
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#E50914", justifyContent: "center",
    alignItems: "center", marginRight: 16,
  },
  avatarImage: {
    width: 64, height: 64, borderRadius: 32,
    marginRight: 16, backgroundColor: "#2a2a2a",
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "900" },
  profileInfo: { flex: 1 },
  username: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  email: { color: "#888", fontSize: 13, marginBottom: 6 },
  roleBadge: {
    flexDirection: "row", alignItems: "center",
    alignSelf: "flex-start", borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  adminBadge: { backgroundColor: "#E50914" },
  userBadge: { backgroundColor: "#333" },
  roleText: { color: "#fff", fontSize: 11, fontWeight: "700", marginLeft: 4 },
  menu: { marginTop: 8, borderBottomWidth: 1, borderBottomColor: "#2a2a2a" },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: "#1f1f1f",
  },
  adminMenuItem: { borderTopWidth: 1, borderTopColor: "#2a2a2a" },
  menuText: { flex: 1, color: "#ccc", fontSize: 15, marginLeft: 14 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    margin: 24, padding: 16, borderWidth: 1,
    borderColor: "#E50914", borderRadius: 8,
  },
  logoutText: { color: "#E50914", fontSize: 16, fontWeight: "700", marginLeft: 8 },
  msg: { color: "#888", fontSize: 15, marginVertical: 16 },
  btn: {
    backgroundColor: "#E50914", borderRadius: 8,
    paddingHorizontal: 28, paddingVertical: 12,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});