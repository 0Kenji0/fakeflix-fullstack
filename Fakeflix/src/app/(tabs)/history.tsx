import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CloseIcon,
  FilmIcon,
  PlayIcon,
  TimeIcon,
} from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface HistoryItem {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl: string;
  watchedTime: number;
  lastWatched: string;
}

function formatTime(seconds: number): string {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function HistoryScreen() {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useFocusEffect(
    useCallback(() => {
      if (token) loadHistory(0);
      else setLoading(false);
    }, [token]),
  );

  const loadHistory = async (p: number) => {
    if (p === 0) setLoading(true);
    try {
      const res = await api.get("/api/history", {
        params: { page: p, size: 20 },
      });
      const items = res.data.content || [];
      if (p === 0) setHistory(items);
      else setHistory((prev) => [...prev, ...items]);
      setTotalPages(res.data.totalPages || 1);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (historyId: number) => {
    if (Platform.OS === "web") {
      if (!window.confirm("Xóa mục này khỏi lịch sử?")) return;
      try {
        await api.delete(`/api/history/${historyId}`);
        setHistory((prev) => prev.filter((h) => h.id !== historyId));
      } catch {}
    } else {
      Alert.alert("Xóa lịch sử", "Bạn có chắc muốn xóa mục này?", [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/history/${historyId}`);
              setHistory((prev) => prev.filter((h) => h.id !== historyId));
            } catch {}
          },
        },
      ]);
    }
  };

  if (!token) {
    return (
      <View style={styles.center}>
        <TimeIcon size={64} color="#444" />
        <Text style={styles.msg}>{"Vui lòng đăng nhập để xem lịch sử"}</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/login" as any)}
        >
          <Text style={styles.btnText}>{"Đăng nhập"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{"Đã xem"}</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/movie/${item.movieId}` as any)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.posterUrl || "" }}
              style={styles.poster}
            />
            <View style={styles.info}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.movieTitle}
              </Text>
              <View style={styles.watchedRow}>
                <TimeIcon size={13} color="#aaa" />
                <Text style={styles.watched}>
                  {" Đã xem: "}
                  {formatTime(item.watchedTime)}
                </Text>
              </View>
              <Text style={styles.date}>
                {item.lastWatched
                  ? new Date(item.lastWatched).toLocaleDateString("vi-VN")
                  : ""}
              </Text>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={(e) => {
                  e.stopPropagation && e.stopPropagation();
                  router.push(
                    `/watch/${item.movieId}?title=${encodeURIComponent(item.movieTitle)}` as any,
                  );
                }}
              >
                <PlayIcon size={12} color="#fff" />
                <Text style={styles.continueBtnText}>{"Xem tiếp"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                deleteHistory(item.id);
              }}
            >
              <CloseIcon size={18} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FilmIcon size={56} color="#444" />
            <Text style={styles.emptyText}>{"Chưa có lịch sử xem"}</Text>
          </View>
        }
        onEndReached={() => {
          if (page + 1 < totalPages) loadHistory(page + 1);
        }}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414", paddingTop: 48 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  header: { color: "#fff", fontSize: 24, fontWeight: "bold", padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  poster: { width: 80, height: 120, backgroundColor: "#333" },
  info: { flex: 1, padding: 12, justifyContent: "center" },
  movieTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },
  watchedRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  watched: { color: "#aaa", fontSize: 12 },
  date: { color: "#666", fontSize: 11, marginBottom: 8 },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E50914",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  deleteBtn: { padding: 12, justifyContent: "flex-start" },
  empty: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#666", fontSize: 15, marginTop: 12 },
  msg: {
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
    marginVertical: 16,
  },
  btn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 24,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
