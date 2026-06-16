import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { MovieDetailSkeleton } from "../../components/SkeletonLoader";


interface Episode {
  id: number;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  duration: number;
}

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  userId: number;
}

function CommentSection({
  movieId,
  token,
}: {
  movieId: string;
  token: string | null;
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadComments();
  }, [movieId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/movies/${movieId}/comments`, {
        params: { page: 0, size: 20 },
      });
      setComments(res.data.content || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const sendComment = async () => {
    if (!content.trim()) return;
    if (!token) {
      router.push("/login" as any);
      return;
    }
    setSending(true);
    try {
      const res = await api.post(`/api/movies/${movieId}/comments`, {
        content,
      });
      setComments((prev) => [res.data, ...prev]);
      setContent("");
    } catch (e) {
    } finally {
      setSending(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await api.delete(`/api/movies/${movieId}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {}
  };

  return (
    <View>
      <View style={commentStyles.divider} />
      <Text
        style={commentStyles.title}
      >{`Bình luận (${comments.length})`}</Text>

      {token ? (
        <View style={commentStyles.inputRow}>
          <TextInput
            style={commentStyles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Viết bình luận..."
            placeholderTextColor="#555"
            multiline
          />
          <TouchableOpacity
            style={[commentStyles.sendBtn, sending && { opacity: 0.6 }]}
            onPress={sendComment}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={commentStyles.loginPrompt}
          onPress={() => router.push("/login" as any)}
        >
          <Text style={commentStyles.loginPromptText}>
            {"Đăng nhập để bình luận"}
          </Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator color="#E50914" style={{ marginTop: 16 }} />
      ) : comments.length === 0 ? (
        <Text style={commentStyles.empty}>{"Chưa có bình luận nào"}</Text>
      ) : (
        comments.map((c) => (
          <View key={c.id} style={commentStyles.commentItem}>
            <View style={commentStyles.avatar}>
              <Text style={commentStyles.avatarText}>
                {c.username?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={commentStyles.commentContent}>
              <View style={commentStyles.commentHeader}>
                <Text style={commentStyles.username}>{c.username}</Text>
                <Text style={commentStyles.date}>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString("vi-VN")
                    : ""}
                </Text>
              </View>
              <Text style={commentStyles.commentText}>{c.content}</Text>
            </View>
            {(user?.id === c.userId || user?.roles?.includes("ADMIN")) && (
              <TouchableOpacity
                onPress={() => deleteComment(c.id)}
                style={commentStyles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </View>
  );
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const [movie, setMovie] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [myRating, setMyRating] = useState(0);

  useEffect(() => {
    loadMovie();
    loadEpisodes();
    if (token) {
      loadMyRating();
      checkFavorite();
    }
  }, [id]);

  const loadMovie = async () => {
    try {
      const res = await api.get(`/api/movies/${id}`);
      setMovie(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodes = async () => {
    try {
      const res = await api.get(`/api/movies/${id}/episodes`);
      const sorted = [...res.data].sort(
        (a: Episode, b: Episode) => a.episodeNumber - b.episodeNumber,
      );
      setEpisodes(sorted);
    } catch (e) {}
  };

  const loadMyRating = async () => {
    try {
      const res = await api.get(`/api/movies/${id}/rating/me`);
      setMyRating(res.data.stars || 0);
    } catch (e) {
      setMyRating(0);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await api.get("/api/favorites", {
        params: { page: 0, size: 100 },
      });
      const favs = res.data.content || [];
      setIsFav(favs.some((f: any) => f.movieId === Number(id)));
    } catch (e) {}
  };

  const toggleFavorite = async () => {
    if (!token) {
      router.push("/login" as any);
      return;
    }
    setFavLoading(true);
    try {
      const res = await api.post(`/api/favorites/${id}/toggle`);
      setIsFav(res.data.includes("Added"));
    } catch (e) {
    } finally {
      setFavLoading(false);
    }
  };

  const rateMovie = async (stars: number) => {
    if (!token) {
      router.push("/login" as any);
      return;
    }
    try {
      await api.post(`/api/movies/${id}/rating`, { stars });
      setMyRating(stars);
      loadMovie();
    } catch (e) {}
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)" as any);
  };

  const handlePlay = () => {
    if (episodes.length > 0) {
      playEpisode(episodes[0]);
    } else {
      router.push(
        `/watch/${id}?title=${encodeURIComponent(movie.title)}&videoUrl=${encodeURIComponent(movie.videoUrl || "")}` as any,
      );
    }
  };

  const playEpisode = (episode: Episode) => {
    router.push(
      `/watch/${id}?title=${encodeURIComponent(
        `${movie.title} - Tập ${episode.episodeNumber}`,
      )}&videoUrl=${encodeURIComponent(episode.videoUrl || "")}` as any,
    );
  };

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{"Không tìm thấy phim"}</Text>
      </View>
    );
  }

  const isSeries = movie.type === "SERIES" || movie.type === "ANIME";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <Image
          source={{ uri: movie.bannerUrl || movie.posterUrl }}
          style={styles.banner}
        />
        <View style={styles.bannerOverlay} />
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={toggleFavorite}
          disabled={favLoading}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={26}
            color={isFav ? "#E50914" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{movie.title}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          {!!movie.releaseYear && (
            <Text style={styles.metaText}>{String(movie.releaseYear)}</Text>
          )}
          {!!movie.type && (
            <View style={styles.metaItem}>
              <Text style={styles.dot}>{"•"}</Text>
              <Text style={styles.metaText}>{movie.type}</Text>
            </View>
          )}
          {!!movie.ageRating && (
            <View style={styles.metaItem}>
              <Text style={styles.dot}>{"•"}</Text>
              <Text style={styles.metaText}>{movie.ageRating}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Text style={styles.dot}>{"•"}</Text>
            <Ionicons name="star" size={13} color="#FFD700" />
            <Text style={styles.metaRating}>
              {" "}
              {movie.averageRating?.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Genres */}
        {movie.genres?.length > 0 && (
          <View style={styles.genres}>
            {movie.genres.map((g: any) => (
              <View key={g.id} style={styles.genreBadge}>
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Play button */}
        <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
          <Ionicons name="play" size={20} color="#000" />
          <Text style={styles.playBtnText}>
            {isSeries && episodes.length > 0 ? "Xem từ tập 1" : "Phát"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Episodes */}
        {isSeries && episodes.length > 0 && (
          <View style={styles.episodeSection}>
            <Text style={styles.episodeHeader}>
              {`Danh sách tập (${episodes.length} tập)`}
            </Text>
            {episodes.map((ep) => (
              <TouchableOpacity
                key={ep.id}
                style={styles.episodeItem}
                onPress={() => playEpisode(ep)}
              >
                <View style={styles.episodeNumber}>
                  <Text style={styles.episodeNumberText}>
                    {String(ep.episodeNumber)}
                  </Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle} numberOfLines={1}>
                    {ep.title || `Tập ${ep.episodeNumber}`}
                  </Text>
                  {!!ep.duration && (
                    <Text style={styles.episodeDuration}>
                      {`${ep.duration} phút`}
                    </Text>
                  )}
                </View>
                <Ionicons name="play-circle" size={28} color="#E50914" />
              </TouchableOpacity>
            ))}
            <View style={styles.divider} />
          </View>
        )}

        {/* Description */}
        {!!movie.description && (
          <Text style={styles.description}>{movie.description}</Text>
        )}

        {/* Info block */}
        <View style={styles.infoBlock}>
          {!!movie.director && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{"Đạo diễn:"}</Text>
              <Text style={styles.infoValue}>{movie.director}</Text>
            </View>
          )}
          {!!movie.cast && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{"Diễn viên:"}</Text>
              <Text style={styles.infoValue}>{movie.cast}</Text>
            </View>
          )}
          {!!movie.country && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{"Quốc gia:"}</Text>
              <Text style={styles.infoValue}>{movie.country}</Text>
            </View>
          )}
          {!!movie.language && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{"Ngôn ngữ:"}</Text>
              <Text style={styles.infoValue}>{movie.language}</Text>
            </View>
          )}
          {!!movie.duration && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{"Thời lượng:"}</Text>
              <Text style={styles.infoValue}>{`${movie.duration} phút`}</Text>
            </View>
          )}
        </View>

        {/* Actors */}
        {movie.actors?.length > 0 && (
          <View>
            <View style={styles.divider} />
            <Text style={styles.actorsTitle}>{"Diễn viên"}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movie.actors.map((actor: any) => (
                <View key={actor.id} style={styles.actorCard}>
                  <Image
                    source={{ uri: actor.avatarUrl || "" }}
                    style={styles.actorAvatar}
                  />
                  <Text style={styles.actorName} numberOfLines={2}>
                    {actor.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.divider} />

        {/* Rating */}
        <Text style={styles.ratingTitle}>{"Đánh giá của bạn"}</Text>
        {!token && (
          <Text style={styles.loginHint}>{"Đăng nhập để đánh giá phim"}</Text>
        )}
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={styles.starBtn}
              onPress={() => rateMovie(star)}
              disabled={!token}
            >
              <Ionicons
                name={star <= myRating ? "star" : "star-outline"}
                size={36}
                color={star <= myRating ? "#FFD700" : "#444"}
              />
            </TouchableOpacity>
          ))}
        </View>
        {myRating > 0 && (
          <Text style={styles.ratedText}>
            {`Bạn đã đánh giá ${myRating} sao`}
          </Text>
        )}

        {/* Comments */}
        <CommentSection movieId={id as string} token={token} />
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
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
  errorText: { color: "#fff", fontSize: 16 },
  bannerWrapper: { width: "100%", height: 280, position: "relative" },
  banner: { width: "100%", height: "100%", backgroundColor: "#2a2a2a" },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  favBtn: {
    position: "absolute",
    top: 48,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  content: { padding: 20 },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
    lineHeight: 32,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { color: "#aaa", fontSize: 13 },
  metaRating: { color: "#FFD700", fontSize: 13, fontWeight: "700" },
  dot: { color: "#555", marginHorizontal: 6, fontSize: 13 },
  genres: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  genreBadge: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: { color: "#ccc", fontSize: 12 },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 14,
    marginBottom: 20,
  },
  playBtnText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
  },
  divider: { height: 1, backgroundColor: "#2a2a2a", marginVertical: 20 },
  episodeSection: { marginBottom: 8 },
  episodeHeader: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
  episodeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  episodeNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  episodeNumberText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  episodeInfo: { flex: 1 },
  episodeTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  episodeDuration: { color: "#888", fontSize: 12 },
  description: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoBlock: { marginBottom: 4 },
  infoRow: { flexDirection: "row", marginBottom: 10 },
  infoLabel: { color: "#666", fontSize: 13, width: 90 },
  infoValue: { color: "#ccc", fontSize: 13, flex: 1 },
  actorsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  actorCard: { alignItems: "center", marginRight: 16, width: 80 },
  actorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2a2a2a",
    marginBottom: 6,
  },
  actorName: { color: "#ccc", fontSize: 11, textAlign: "center" },
  ratingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  loginHint: { color: "#666", fontSize: 12, marginBottom: 8 },
  stars: { flexDirection: "row", marginBottom: 8 },
  starBtn: { padding: 4, marginRight: 8 },
  ratedText: { color: "#FFD700", fontSize: 13, marginTop: 4 },
});

const commentStyles = StyleSheet.create({
  divider: { height: 1, backgroundColor: "#2a2a2a", marginVertical: 20 },
  title: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 16 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    maxHeight: 100,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  loginPromptText: { color: "#888", fontSize: 14 },
  empty: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 16,
  },
  commentItem: { flexDirection: "row", marginBottom: 16 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  commentContent: { flex: 1 },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: { color: "#fff", fontWeight: "700", fontSize: 13, marginRight: 8 },
  date: { color: "#666", fontSize: 11 },
  commentText: { color: "#ccc", fontSize: 14, lineHeight: 20 },
  deleteBtn: { padding: 4, marginLeft: 8 },
});