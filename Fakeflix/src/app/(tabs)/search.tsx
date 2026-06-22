import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FilmIcon, SearchIcon, StarIcon } from "../../components/icons";
import api from "../../services/api";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseYear: number;
  type: string;
  averageRating: number;
}

export default function SearchScreen() {
  const params = useLocalSearchParams<{
    q?: string;
    type?: string;
    genreId?: string;
    genreName?: string;
  }>();

  const [keyword, setKeyword] = useState(params.q || "");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const activeGenreName = params.genreName || null;
  const debounceRef = useRef<any>(null);

  // Hàm thực hiện tìm kiếm (không thay đổi keyword state)
  const doSearch = async (text: string, type?: string, genreId?: string) => {
    if (!text.trim() && !type && !genreId) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get("/api/movies/search", {
        params: {
          keyword: text || undefined,
          type: type || undefined,
          genreId: genreId || undefined,
          page: 0,
          size: 30,
        },
      });
      setResults(res.data.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Khi người dùng gõ: chỉ update keyword, debounce mới gọi API
  const handleChangeText = (text: string) => {
    setKeyword(text);
    clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      doSearch(text, params.type, params.genreId);
    }, 350);
  };

  // Áp dụng query params từ navbar/dropdown trang chủ ngay khi vào trang
  useEffect(() => {
    if (params.q) {
      setKeyword(params.q);
      doSearch(params.q, params.type, params.genreId);
    } else if (params.type || params.genreId) {
      doSearch("", params.type, params.genreId);
    }
    return () => clearTimeout(debounceRef.current);
  }, [params.q, params.type, params.genreId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"Tìm kiếm"}</Text>
        {activeGenreName && (
          <View style={styles.genreBadge}>
            <Text style={styles.genreBadgeText}>{activeGenreName}</Text>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/search" as any)}
            >
              <Text style={styles.genreBadgeClose}>{"✕"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.searchBar}>
        <SearchIcon size={18} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Tìm phim, thể loại..."
          placeholderTextColor="#666"
          value={keyword}
          onChangeText={handleChangeText}
          returnKeyType="search"
          onSubmitEditing={() => doSearch(keyword, params.type, params.genreId)}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {keyword.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              clearTimeout(debounceRef.current);
              setKeyword("");
              setResults([]);
              setSearched(false);
            }}
          >
            <Text style={styles.clearBtn}>{"✕"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <ActivityIndicator color="#E50914" style={{ marginTop: 40 }} />
      )}

      {!loading && searched && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <SearchIcon size={60} color="#333" />
          <Text style={styles.emptyTitle}>{"Không tìm thấy"}</Text>
          <Text style={styles.emptyMsg}>{"Thử tìm với từ khóa khác"}</Text>
        </View>
      )}

      {!loading && !searched && (
        <View style={styles.emptyContainer}>
          <FilmIcon size={60} color="#333" />
          <Text style={styles.emptyTitle}>{"Tìm kiếm phim"}</Text>
          <Text style={styles.emptyMsg}>{"Nhập tên phim để bắt đầu"}</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/movie/${item.id}` as any)}
            activeOpacity={0.8}
          >
            <View style={styles.posterWrapper}>
              <Image source={{ uri: item.posterUrl }} style={styles.poster} />
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
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.ratingRow}>
              <StarIcon size={10} color="#FFD700" filled />
              <Text style={styles.ratingText}>
                {" "}
                {item.averageRating?.toFixed(1)}
              </Text>
              {!!item.releaseYear && (
                <Text style={styles.year}>
                  {" • "}
                  {item.releaseYear}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  genreBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(229,9,20,0.15)",
    borderWidth: 1,
    borderColor: "rgba(229,9,20,0.4)",
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 8,
    gap: 8,
  },
  genreBadgeText: { color: "#ff8585", fontSize: 12.5, fontWeight: "600" },
  genreBadgeClose: { color: "#ff8585", fontSize: 12, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, color: "#fff", fontSize: 15, marginLeft: 8 },
  clearBtn: { color: "#666", fontSize: 16, paddingHorizontal: 4 },
  emptyContainer: { alignItems: "center", paddingTop: 60 },
  emptyTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 12 },
  emptyMsg: { color: "#666", fontSize: 13, marginTop: 6 },
  grid: { paddingHorizontal: 12, paddingBottom: 40 },
  row: { marginBottom: 8 },
  card: { flex: 1, marginHorizontal: 4 },
  posterWrapper: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
  },
  poster: { width: "100%", height: "100%" },
  typeBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  animeBadge: { backgroundColor: "#6C5CE7" },
  seriesBadge: { backgroundColor: "#0984e3" },
  movieBadge: { backgroundColor: "#E50914" },
  typeText: { color: "#fff", fontSize: 8, fontWeight: "800" },
  title: { color: "#ccc", fontSize: 11, marginTop: 5, lineHeight: 15 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  ratingText: { color: "#FFD700", fontSize: 10 },
  year: { color: "#666", fontSize: 10 },
});
