import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HeartIcon } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface Favorite {
  id: number;
  movieId: number;
  movieTitle: string;
  posterUrl: string;
}

export default function FavoritesScreen() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (token) loadFavorites();
      else setLoading(false);
    }, [token]),
  );

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/favorites", {
        params: { page: 0, size: 50 },
      });
      setFavorites(res.data.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={styles.center}>
        <HeartIcon size={64} color="#444" />
        <Text style={styles.msg}>{"Đăng nhập để xem phim yêu thích"}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"Yêu thích"}</Text>
        <Text style={styles.headerCount}>{`${favorites.length} phim`}</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/movie/${item.movieId}` as any)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.posterUrl }} style={styles.poster} />
            <Text style={styles.title} numberOfLines={2}>
              {item.movieTitle}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <HeartIcon size={64} color="#333" />
            <Text style={styles.emptyTitle}>{"Chưa có phim yêu thích"}</Text>
            <Text style={styles.emptyMsg}>
              {"Nhấn icon tim trên trang phim để lưu"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  headerCount: { color: "#666", fontSize: 13 },
  grid: { paddingHorizontal: 12, paddingBottom: 40 },
  row: { marginBottom: 8 },
  card: { flex: 1, marginHorizontal: 4 },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 6,
    backgroundColor: "#2a2a2a",
  },
  title: { color: "#ccc", fontSize: 11, marginTop: 5, lineHeight: 15 },
  emptyContainer: { flex: 1, alignItems: "center", paddingTop: 80 },
  emptyTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 12 },
  emptyMsg: { color: "#666", fontSize: 13, textAlign: "center", marginTop: 8 },
  msg: {
    color: "#888",
    fontSize: 15,
    marginVertical: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  btn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
