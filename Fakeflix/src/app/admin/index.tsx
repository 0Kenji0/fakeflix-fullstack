import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  type: string;
  status: string;
  averageRating: number;
}

export default function AdminScreen() {
  const { user, token } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user?.roles?.includes("ADMIN")) {
      router.replace("/(tabs)" as any);
      return;
    }
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/movies");
      setMovies(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id: number, title: string) => {
    const confirm =
      Platform.OS === "web" ? window.confirm(`Xóa phim "${title}"?`) : true;

    if (!confirm) return;

    try {
      await api.delete(`/api/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("Xóa thất bại!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý phim</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/admin/movie-form" as any)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{movies.length}</Text>
          <Text style={styles.statLabel}>Tổng phim</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {movies.filter((m) => m.status === "ONGOING").length}
          </Text>
          <Text style={styles.statLabel}>Đang chiếu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {movies.filter((m) => m.type === "ANIME").length}
          </Text>
          <Text style={styles.statLabel}>Anime</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {movies.filter((m) => m.type === "MOVIE").length}
          </Text>
          <Text style={styles.statLabel}>Phim lẻ</Text>
        </View>
      </View>

      {/* Genre management */}
      <TouchableOpacity
        style={styles.genreBtn}
        onPress={() => router.push("/admin/genres" as any)}
      >
        <Ionicons name="grid-outline" size={18} color="#E50914" />
        <Text style={styles.genreBtnText}>Quản lý thể loại</Text>
        <Ionicons name="chevron-forward" size={18} color="#555" />
      </TouchableOpacity>

      {/* Movie list */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image source={{ uri: item.posterUrl }} style={styles.poster} />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.movieMeta}>
                <View
                  style={[
                    styles.typeBadge,
                    item.type === "ANIME"
                      ? styles.animeBadge
                      : item.type === "SERIES"
                        ? styles.seriesBadge
                        : styles.movieBadge,
                  ]}
                >
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {item.averageRating?.toFixed(1)}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push(`/admin/movie-form?id=${item.id}` as any)
                }
              >
                <Ionicons name="pencil" size={18} color="#0984e3" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteMovie(item.id, item.title)}
              >
                <Ionicons name="trash" size={18} color="#E50914" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có phim nào</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },

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
  headerTitle: { flex: 1, color: "#fff", fontSize: 20, fontWeight: "800" },
  addBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 8,
  },

  statsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  statNumber: { color: "#E50914", fontSize: 22, fontWeight: "900" },
  statLabel: { color: "#888", fontSize: 11, marginTop: 2 },

  genreBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  genreBtnText: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "600" },

  list: { paddingHorizontal: 16, paddingBottom: 40 },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  poster: { width: 60, height: 90, backgroundColor: "#2a2a2a" },
  movieInfo: { flex: 1, padding: 12, gap: 6 },
  movieTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  movieMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  animeBadge: { backgroundColor: "#6C5CE7" },
  seriesBadge: { backgroundColor: "#0984e3" },
  movieBadge: { backgroundColor: "#E50914" },
  typeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  statusText: { color: "#888", fontSize: 11 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { color: "#FFD700", fontSize: 12 },

  actions: { flexDirection: "column", padding: 12, gap: 12 },
  editBtn: {
    backgroundColor: "rgba(9,132,227,0.15)",
    borderRadius: 8,
    padding: 8,
  },
  deleteBtn: {
    backgroundColor: "rgba(229,9,20,0.15)",
    borderRadius: 8,
    padding: 8,
  },
  empty: { color: "#666", textAlign: "center", marginTop: 40 },
});
