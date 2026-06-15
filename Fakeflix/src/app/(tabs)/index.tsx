import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { HomeScreenSkeleton } from "../../components/SkeletonLoader";

const CARD_WIDTH = 130;

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  bannerUrl: string;
  averageRating: number;
  type: string;
  status: string;
  releaseYear: number;
  description: string;
}

export default function HomeScreen() {
  const { user, token } = useAuth();
  const [featured, setFeatured] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [mostViewed, setMostViewed] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    Platform.OS === "web" ? window.innerWidth : Dimensions.get("window").width,
  );
  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadData();
    if (Platform.OS === "web") {
      const handleResize = () => setScreenWidth(window.innerWidth);
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (featured.length <= 1) return;
    timerRef.current = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [featured]);

  const loadData = async () => {
    try {
      const [f, t, m] = await Promise.all([
        api.get("/api/movies/featured"),
        api.get("/api/movies/top-rated"),
        api.get("/api/movies/most-viewed"),
      ]);
      setFeatured(f.data);
      setTopRated(t.data);
      setMostViewed(m.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/(tabs)/search?q=${encodeURIComponent(searchText)}` as any);
      setSearchText("");
    }
  };

  const MovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/movie/${item.id}` as any)}
      activeOpacity={0.75}
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
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.averageRating?.toFixed(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {item.releaseYear ? (
        <Text style={styles.cardYear}>{String(item.releaseYear)}</Text>
      ) : null}
    </TouchableOpacity>
  );

  const Section = ({ title, data }: { title: string; data: Movie[] }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <MovieCard item={item} />}
        ListEmptyComponent={<Text style={styles.empty}>{"Chưa có phim"}</Text>}
      />
    </View>
  );

  if (loading) {
    return <HomeScreenSkeleton />;
  }

  const WebHeader = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        height: 64,
        background: scrolled
          ? "rgba(20,20,20,0.98)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={() => router.push("/(tabs)" as any)}
        style={{
          color: "#E50914",
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 3,
          cursor: "pointer",
          marginRight: 40,
          userSelect: "none",
        }}
      >
        {"FAKEFLIX"}
      </div>

      <div style={{ display: "flex", gap: 4, flex: 1, alignItems: "center" }}>
        {[
          { label: "Trang chủ", route: "/(tabs)" },
          { label: "Phim lẻ", route: "/(tabs)/search?type=MOVIE" },
          { label: "Series", route: "/(tabs)/search?type=SERIES" },
          { label: "Anime", route: "/(tabs)/search?type=ANIME" },
          { label: "Tìm kiếm", route: "/(tabs)/search" },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => router.push(item.route as any)}
            style={{
              color: "#ccc",
              fontSize: 13,
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#ccc";
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent";
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 20,
          paddingLeft: 12,
          paddingRight: 4,
          marginRight: 16,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <span style={{ color: "#888", fontSize: 14, marginRight: 6 }}>
          {"🔍"}
        </span>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Tìm phim..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 13,
            width: 160,
            padding: "7px 4px",
          }}
        />
      </div>

      {token && user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user.roles?.includes("ADMIN") ? (
            <div
              onClick={() => router.push("/admin" as any)}
              style={{
                color: "#E50914",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                padding: "6px 12px",
                border: "1px solid #E50914",
                borderRadius: 6,
              }}
            >
              {"ADMIN"}
            </div>
          ) : null}
          {[
            { label: "Đã xem", route: "/(tabs)/history" },
            { label: "Yêu thích", route: "/(tabs)/favorites" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => router.push(item.route as any)}
              style={{
                color: "#ccc",
                fontSize: 13,
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: 6,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#ccc";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
              }}
            >
              {item.label}
            </div>
          ))}
          <div
            onClick={() => router.push("/(tabs)/profile" as any)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#E50914",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 800,
              color: "#fff",
              fontSize: 15,
              marginLeft: 4,
            }}
          >
            {user.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      ) : (
        <button
          onClick={() => router.push("/login" as any)}
          style={{
            backgroundColor: "#E50914",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {"Đăng nhập"}
        </button>
      )}
    </div>
  );

  return (
    <View style={styles.container}>
      {Platform.OS !== "web" ? (
        <View style={styles.mobileNavbar}>
          <Text style={styles.navLogo}>{"FAKEFLIX"}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {token && user ? (
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile" as any)}
              >
                <View style={styles.mobileAvatar}>
                  <Text style={styles.mobileAvatarText}>
                    {user.username?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.push("/login" as any)}>
                <Text style={styles.mobileLoginBtn}>{"Đăng nhập"}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/search" as any)}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === "web" ? (
          // @ts-ignore
          <WebHeader />
        ) : null}

        {featured.length > 0 ? (
          <View style={{ marginBottom: 24 }}>
            {Platform.OS === "web" ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 520,
                  overflow: "hidden",
                }}
                onMouseEnter={() => clearInterval(timerRef.current)}
                onMouseLeave={() => {
                  timerRef.current = setInterval(() => {
                    setSliderIndex((prev) => (prev + 1) % featured.length);
                  }, 5000);
                }}
              >
                {featured.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: i === sliderIndex ? 1 : 0,
                      transition: "opacity 0.8s ease-in-out",
                      pointerEvents: i === sliderIndex ? "auto" : "none",
                    }}
                  >
                    <img
                      src={item.bannerUrl || item.posterUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      alt={item.title}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.4) 50%, rgba(20,20,20,0.05) 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 80,
                        left: 48,
                        right: 48,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 12,
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            backgroundColor:
                              item.type === "ANIME"
                                ? "#6C5CE7"
                                : item.type === "SERIES"
                                  ? "#0984e3"
                                  : "#E50914",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: 4,
                            letterSpacing: 1,
                          }}
                        >
                          {item.type}
                        </span>
                        {item.releaseYear ? (
                          <span style={{ color: "#aaa", fontSize: 14 }}>
                            {String(item.releaseYear)}
                          </span>
                        ) : null}
                        <span
                          style={{
                            color: "#FFD700",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {"★ " + item.averageRating?.toFixed(1)}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          fontSize: 48,
                          fontWeight: 900,
                          marginBottom: 12,
                          lineHeight: "1.1",
                          textShadow: "2px 2px 12px rgba(0,0,0,0.8)",
                          maxWidth: 700,
                        }}
                      >
                        {item.title}
                      </div>
                      {item.description ? (
                        <div
                          style={{
                            color: "#bbb",
                            fontSize: 14,
                            lineHeight: "1.7",
                            marginBottom: 24,
                            maxWidth: 560,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </div>
                      ) : null}
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={() =>
                            router.push(`/movie/${item.id}` as any)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: "#fff",
                            color: "#000",
                            border: "none",
                            borderRadius: 6,
                            padding: "12px 28px",
                            fontSize: 16,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {"▶  Xem ngay"}
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/movie/${item.id}` as any)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: "rgba(109,109,110,0.7)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "12px 28px",
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {"ⓘ  Chi tiết"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {featured.length > 1 ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 24,
                      right: 48,
                      display: "flex",
                      gap: 8,
                      zIndex: 10,
                    }}
                  >
                    {featured.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setSliderIndex(i)}
                        style={{
                          width: i === sliderIndex ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor:
                            i === sliderIndex
                              ? "#E50914"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <FlatList
                data={featured}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / screenWidth,
                  );
                  setSliderIndex(index);
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push(`/movie/${item.id}` as any)}
                  >
                    <View
                      style={{
                        width: screenWidth,
                        height: 400,
                        position: "relative",
                      }}
                    >
                      <Image
                        source={{ uri: item.bannerUrl || item.posterUrl }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.45)",
                        }}
                      />
                      <View style={styles.slideContent}>
                        <Text style={styles.slideTitle}>{item.title}</Text>
                        <TouchableOpacity
                          style={styles.playButton}
                          onPress={() =>
                            router.push(`/movie/${item.id}` as any)
                          }
                        >
                          <Text style={styles.playButtonText}>
                            {"▶ Xem ngay"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : null}

        <Section title="Phim Nổi Bật" data={featured} />
        <Section title="Đánh Giá Cao" data={topRated} />
        <Section title="Xem Nhiều Nhất" data={mostViewed} />
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },

  scrollView: { flex: 1 },
  mobileNavbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  navLogo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#E50914",
    letterSpacing: 3,
  },
  mobileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
  },
  mobileAvatarText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  mobileLoginBtn: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#E50914",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  slideContent: { position: "absolute", bottom: 40, left: 20, right: 20 },
  slideTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
    lineHeight: 30,
  },
  playButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  playButtonText: { color: "#000", fontWeight: "800", fontSize: 15 },
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    backgroundColor: "#E50914",
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  empty: { color: "#666", paddingLeft: 8 },
  card: { width: CARD_WIDTH, marginRight: 12 },
  posterWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
  },
  poster: { width: "100%", height: "100%" },
  typeBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  animeBadge: { backgroundColor: "#6C5CE7" },
  seriesBadge: { backgroundColor: "#0984e3" },
  movieBadge: { backgroundColor: "#E50914" },
  typeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 3,
  },
  cardTitle: {
    color: "#e0e0e0",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
    lineHeight: 16,
  },
  cardYear: { color: "#666", fontSize: 11, marginTop: 2 },
});