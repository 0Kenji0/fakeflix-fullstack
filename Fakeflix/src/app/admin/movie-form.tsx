import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

interface Genre {
  id: number;
  name: string;
}

const TMDB_API_KEY = "a49151b058d6cd2680e916828cc8801a";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/original";

const OptionBtn = ({ label, value, current, onPress }: any) => (
  <TouchableOpacity
    style={[styles.optionBtn, current === value && styles.optionBtnActive]}
    onPress={() => onPress(value)}
  >
    <Text
      style={[styles.optionText, current === value && styles.optionTextActive]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

function EpisodeManager({ movieId }: { movieId: string }) {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEpNum, setNewEpNum] = useState("");
  const [newEpTitle, setNewEpTitle] = useState("");
  const [newEpUrl, setNewEpUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEpisodes();
  }, [movieId]);

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/movies/${movieId}/episodes`);
      setEpisodes(res.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const addEpisode = async () => {
    if (!newEpNum) {
      alert("Nhập số tập!");
      return;
    }
    if (!newEpUrl) {
      alert("Nhập Video URL!");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/api/movies/${movieId}/episodes`, {
        episodeNumber: parseInt(newEpNum),
        title: newEpTitle || `Tập ${newEpNum}`,
        videoUrl: newEpUrl,
      });
      setNewEpNum("");
      setNewEpTitle("");
      setNewEpUrl("");
      loadEpisodes();
    } catch {
      alert("Thêm tập thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const deleteEpisode = async (epId: number) => {
    try {
      await api.delete(`/api/movies/${movieId}/episodes/${epId}`);
      setEpisodes((prev) => prev.filter((e) => e.id !== epId));
    } catch {
      alert("Xóa thất bại!");
    }
  };

  return (
    <View>
      <Text style={styles.sectionLabel}>{"QUẢN LÝ TẬP PHIM"}</Text>
      {loading ? (
        <ActivityIndicator color="#E50914" />
      ) : episodes.length === 0 ? (
        <Text style={styles.emptyEp}>{"Chưa có tập nào"}</Text>
      ) : (
        episodes.map((ep) => (
          <View key={ep.id} style={styles.epItem}>
            <View style={styles.epInfo}>
              <Text style={styles.epNum}>{"Tập " + ep.episodeNumber}</Text>
              <Text style={styles.epTitle} numberOfLines={1}>
                {ep.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteEpisode(ep.id)}
              style={styles.epDelete}
            >
              <Ionicons name="trash" size={18} color="#E50914" />
            </TouchableOpacity>
          </View>
        ))
      )}
      <Text style={styles.label}>{"Thêm tập mới"}</Text>
      <View style={styles.row}>
        <View style={[styles.halfLeft, { flex: 0.4 }]}>
          <TextInput
            style={styles.input}
            value={newEpNum}
            onChangeText={setNewEpNum}
            placeholder="Số tập"
            placeholderTextColor="#555"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.halfRight, { flex: 0.6 }]}>
          <TextInput
            style={styles.input}
            value={newEpTitle}
            onChangeText={setNewEpTitle}
            placeholder="Tên tập (tuỳ chọn)"
            placeholderTextColor="#555"
          />
        </View>
      </View>
      <TextInput
        style={styles.input}
        value={newEpUrl}
        onChangeText={setNewEpUrl}
        placeholder="Video URL (mp4 hoặc m3u8)"
        placeholderTextColor="#555"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.addEpBtn, saving && { opacity: 0.6 }]}
        onPress={addEpisode}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addEpBtnText}>{"+ Thêm tập"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function MovieFormScreen() {
  const { id } = useLocalSearchParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedActors, setSelectedActors] = useState<number[]>([]);

  const [showTmdb, setShowTmdb] = useState(false);
  const [tmdbSearch, setTmdbSearch] = useState("");
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [tmdbSearching, setTmdbSearching] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [duration, setDuration] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState("");
  const [totalEpisodes, setTotalEpisodes] = useState("");
  const [slug, setSlug] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("ONGOING");
  const [type, setType] = useState("MOVIE");

  useEffect(() => {
    loadGenres();
    if (isEdit) loadMovie();
  }, []);

  const loadGenres = async () => {
    try {
      const res = await api.get("/api/genres");
      setGenres(res.data);
    } catch {}
  };

  const loadMovie = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/movies/${id}`);
      const m = res.data;
      setTitle(m.title || "");
      setDescription(m.description || "");
      setPosterUrl(m.posterUrl || "");
      setBannerUrl(m.bannerUrl || "");
      setTrailerUrl(m.trailerUrl || "");
      setVideoUrl(m.videoUrl || "");
      setReleaseYear(m.releaseYear?.toString() || "");
      setDuration(m.duration?.toString() || "");
      setCountry(m.country || "");
      setLanguage(m.language || "");
      setAgeRating(m.ageRating || "");
      setDirector(m.director || "");
      setCast(m.cast || "");
      setTotalEpisodes(m.totalEpisodes?.toString() || "");
      setSlug(m.slug || "");
      setFeatured(m.featured || false);
      setStatus(m.status || "ONGOING");
      setType(m.type || "MOVIE");
      setSelectedGenres(m.genres?.map((g: Genre) => g.id) || []);
      setSelectedActors(m.actors?.map((a: any) => a.id) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const autoSlug = (text: string) => {
    setTitle(text);
    if (!isEdit) setSlug(generateSlug(text));
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((i) => i !== genreId)
        : [...prev, genreId],
    );
  };

  const searchTMDB = async (query: string) => {
    setTmdbSearch(query);
    if (!query.trim()) {
      setTmdbResults([]);
      return;
    }
    setTmdbSearching(true);
    try {
      const res = await fetch(
        `${TMDB_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=vi-VN`,
      );
      const data = await res.json();
      setTmdbResults(
        data.results
          ?.filter(
            (r: any) => r.media_type === "movie" || r.media_type === "tv",
          )
          .slice(0, 8) || [],
      );
    } catch {
    } finally {
      setTmdbSearching(false);
    }
  };

  const importActors = async (castList: any[]) => {
    const actorIds: number[] = [];
    for (const member of castList.slice(0, 5)) {
      try {
        const searchRes = await api.get("/api/actors/search", {
          params: { keyword: member.name },
        });
        if (searchRes.data.length > 0) {
          actorIds.push(searchRes.data[0].id);
        } else {
          const createRes = await api.post("/api/actors", {
            name: member.name,
            avatarUrl: member.profile_path
              ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
              : "",
            biography: "",
          });
          actorIds.push(createRes.data.id);
        }
      } catch (e) {}
    }
    setSelectedActors(actorIds);
  };

  const importFromTMDB = async (item: any) => {
    const isTV = item.media_type === "tv";
    try {
      const detailRes = await fetch(
        `${TMDB_BASE}/${isTV ? "tv" : "movie"}/${item.id}?api_key=${TMDB_API_KEY}&language=vi-VN&append_to_response=credits,videos`,
      );
      const detail = await detailRes.json();
      const name = detail.title || detail.name || "";
      setTitle(name);
      setDescription(detail.overview || "");
      setPosterUrl(
        detail.poster_path ? `${TMDB_IMAGE}${detail.poster_path}` : "",
      );
      setBannerUrl(
        detail.backdrop_path ? `${TMDB_IMAGE}${detail.backdrop_path}` : "",
      );
      setReleaseYear(
        (detail.release_date || detail.first_air_date || "").split("-")[0],
      );
      setDuration(
        detail.runtime?.toString() ||
          detail.episode_run_time?.[0]?.toString() ||
          "",
      );
      setCountry(detail.production_countries?.[0]?.name || "");
      setLanguage(detail.original_language || "");

      const trailer = detail.videos?.results?.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube",
      );
      if (trailer)
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);

      const dir = detail.credits?.crew?.find((c: any) => c.job === "Director");
      if (dir) setDirector(dir.name);

      const castList = detail.credits?.cast
        ?.slice(0, 5)
        .map((c: any) => c.name)
        .join(", ");
      if (castList) setCast(castList);

      if (isTV) {
        const isAnime = detail.genres?.some(
          (g: any) => g.name === "Animation" || g.name === "Anime",
        );
        setType(isAnime ? "ANIME" : "SERIES");
        setTotalEpisodes(detail.number_of_episodes?.toString() || "");
      } else {
        setType("MOVIE");
        setTotalEpisodes("1");
      }

      setSlug(`${generateSlug(name)}-${Date.now()}`);

      // Tự động tạo Actor entities từ TMDB
      if (detail.credits?.cast?.length > 0) {
        await importActors(detail.credits.cast);
      }

      setShowTmdb(false);
      setTmdbResults([]);
      setTmdbSearch("");
      alert(`Đã import: ${name}`);
    } catch {
      alert("Import thất bại, thử lại!");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tên phim!");
      return;
    }
    if (!slug.trim()) {
      alert("Vui lòng nhập slug!");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        posterUrl,
        bannerUrl,
        trailerUrl,
        videoUrl,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        duration: duration ? parseInt(duration) : null,
        country,
        language,
        ageRating,
        director,
        cast,
        totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
        slug,
        featured,
        status,
        type,
        genreIds: selectedGenres,
        actorIds: selectedActors,
      };
      if (isEdit) await api.put(`/api/movies/${id}`, payload);
      else await api.post("/api/movies", payload);
      alert(isEdit ? "Cập nhật thành công!" : "Thêm phim thành công!");
      router.back();
    } catch (e: any) {
      alert(e?.response?.data?.error || "Có lỗi xảy ra!");
    } finally {
      setSaving(false);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "Sửa phim" : "Thêm phim mới"}
        </Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>{"Lưu"}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* TMDB Import */}
        <TouchableOpacity
          style={styles.tmdbToggle}
          onPress={() => setShowTmdb(!showTmdb)}
        >
          <Ionicons name="cloud-download-outline" size={18} color="#E50914" />
          <Text style={styles.tmdbToggleText}>{"Import từ TMDB"}</Text>
          <Ionicons
            name={showTmdb ? "chevron-up" : "chevron-down"}
            size={16}
            color="#E50914"
          />
        </TouchableOpacity>

        {showTmdb && (
          <View style={styles.tmdbBox}>
            <View style={styles.tmdbSearchBar}>
              <Ionicons name="search" size={16} color="#888" />
              <TextInput
                style={styles.tmdbInput}
                value={tmdbSearch}
                onChangeText={searchTMDB}
                placeholder="Tìm phim trên TMDB..."
                placeholderTextColor="#555"
                autoFocus
              />
              {tmdbSearching && (
                <ActivityIndicator size="small" color="#E50914" />
              )}
            </View>
            {tmdbResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.tmdbItem}
                onPress={() => importFromTMDB(item)}
              >
                <Image
                  source={{
                    uri: item.poster_path
                      ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                      : "",
                  }}
                  style={styles.tmdbPoster}
                />
                <View style={styles.tmdbInfo}>
                  <Text style={styles.tmdbTitle} numberOfLines={2}>
                    {item.title || item.name}
                  </Text>
                  <Text style={styles.tmdbYear}>
                    {
                      (item.release_date || item.first_air_date || "").split(
                        "-",
                      )[0]
                    }
                    {" • "}
                    {item.media_type === "tv" ? "Series/Anime" : "Phim lẻ"}
                  </Text>
                </View>
                <Ionicons name="download-outline" size={20} color="#E50914" />
              </TouchableOpacity>
            ))}
            {!tmdbSearching && tmdbSearch && tmdbResults.length === 0 && (
              <Text style={styles.tmdbEmpty}>{"Không tìm thấy kết quả"}</Text>
            )}
          </View>
        )}

        <Text style={styles.sectionLabel}>{"THÔNG TIN CƠ BẢN"}</Text>

        <Text style={styles.label}>{"Tên phim *"}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={autoSlug}
          placeholder="Nhập tên phim"
          placeholderTextColor="#555"
        />

        <Text style={styles.label}>{"Slug *"}</Text>
        <TextInput
          style={styles.input}
          value={slug}
          onChangeText={setSlug}
          placeholder="ten-phim-url"
          placeholderTextColor="#555"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{"Mô tả"}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả phim"
          placeholderTextColor="#555"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionLabel}>{"ĐƯỜNG DẪN"}</Text>

        <Text style={styles.label}>{"Poster URL"}</Text>
        <TextInput
          style={styles.input}
          value={posterUrl}
          onChangeText={setPosterUrl}
          placeholder="https://..."
          placeholderTextColor="#555"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{"Banner URL"}</Text>
        <TextInput
          style={styles.input}
          value={bannerUrl}
          onChangeText={setBannerUrl}
          placeholder="https://..."
          placeholderTextColor="#555"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{"Trailer URL"}</Text>
        <TextInput
          style={styles.input}
          value={trailerUrl}
          onChangeText={setTrailerUrl}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor="#555"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{"Video URL (phim lẻ)"}</Text>
        <TextInput
          style={styles.input}
          value={videoUrl}
          onChangeText={setVideoUrl}
          placeholder="https://..."
          placeholderTextColor="#555"
          autoCapitalize="none"
        />

        <Text style={styles.sectionLabel}>{"CHI TIẾT"}</Text>

        <View style={styles.row}>
          <View style={styles.halfLeft}>
            <Text style={styles.label}>{"Năm phát hành"}</Text>
            <TextInput
              style={styles.input}
              value={releaseYear}
              onChangeText={setReleaseYear}
              placeholder="2024"
              placeholderTextColor="#555"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfRight}>
            <Text style={styles.label}>{"Thời lượng (phút)"}</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="120"
              placeholderTextColor="#555"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfLeft}>
            <Text style={styles.label}>{"Quốc gia"}</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Japan"
              placeholderTextColor="#555"
            />
          </View>
          <View style={styles.halfRight}>
            <Text style={styles.label}>{"Ngôn ngữ"}</Text>
            <TextInput
              style={styles.input}
              value={language}
              onChangeText={setLanguage}
              placeholder="Japanese"
              placeholderTextColor="#555"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfLeft}>
            <Text style={styles.label}>{"Giới hạn tuổi"}</Text>
            <TextInput
              style={styles.input}
              value={ageRating}
              onChangeText={setAgeRating}
              placeholder="13+"
              placeholderTextColor="#555"
            />
          </View>
          <View style={styles.halfRight}>
            <Text style={styles.label}>{"Số tập"}</Text>
            <TextInput
              style={styles.input}
              value={totalEpisodes}
              onChangeText={setTotalEpisodes}
              placeholder="12"
              placeholderTextColor="#555"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>{"Đạo diễn"}</Text>
        <TextInput
          style={styles.input}
          value={director}
          onChangeText={setDirector}
          placeholder="Tên đạo diễn"
          placeholderTextColor="#555"
        />

        <Text style={styles.label}>{"Diễn viên"}</Text>
        <TextInput
          style={styles.input}
          value={cast}
          onChangeText={setCast}
          placeholder="Diễn viên 1, Diễn viên 2..."
          placeholderTextColor="#555"
        />

        <Text style={styles.sectionLabel}>{"LOẠI PHIM"}</Text>
        <View style={styles.optionRow}>
          <OptionBtn
            label="Phim lẻ"
            value="MOVIE"
            current={type}
            onPress={setType}
          />
          <OptionBtn
            label="Series"
            value="SERIES"
            current={type}
            onPress={setType}
          />
          <OptionBtn
            label="Anime"
            value="ANIME"
            current={type}
            onPress={setType}
          />
        </View>

        <Text style={styles.sectionLabel}>{"TRẠNG THÁI"}</Text>
        <View style={styles.optionRow}>
          <OptionBtn
            label="Đang chiếu"
            value="ONGOING"
            current={status}
            onPress={setStatus}
          />
          <OptionBtn
            label="Hoàn thành"
            value="COMPLETED"
            current={status}
            onPress={setStatus}
          />
          <OptionBtn
            label="Sắp ra mắt"
            value="UPCOMING"
            current={status}
            onPress={setStatus}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>{"Phim nổi bật"}</Text>
          <Switch
            value={featured}
            onValueChange={setFeatured}
            trackColor={{ false: "#333", true: "#E50914" }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionLabel}>{"THỂ LOẠI"}</Text>
        <View style={styles.genreGrid}>
          {genres.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.genreChip,
                selectedGenres.includes(g.id) && styles.genreChipActive,
              ]}
              onPress={() => toggleGenre(g.id)}
            >
              <Text
                style={[
                  styles.genreChipText,
                  selectedGenres.includes(g.id) && styles.genreChipTextActive,
                ]}
              >
                {g.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isEdit && (type === "SERIES" || type === "ANIME") && (
          <EpisodeManager movieId={id as string} />
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
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
  headerTitle: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "800" },
  saveBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  form: { padding: 16 },
  tmdbToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229,9,20,0.1)",
    borderWidth: 1,
    borderColor: "#E50914",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tmdbToggleText: {
    flex: 1,
    color: "#E50914",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 8,
  },
  tmdbBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tmdbSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tmdbInput: { flex: 1, color: "#fff", fontSize: 14, marginLeft: 8 },
  tmdbItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  tmdbPoster: {
    width: 46,
    height: 69,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  tmdbInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  tmdbTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  tmdbYear: { color: "#888", fontSize: 11 },
  tmdbEmpty: { color: "#666", textAlign: "center", padding: 16 },
  sectionLabel: {
    color: "#E50914",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 24,
    marginBottom: 12,
  },
  label: { color: "#888", fontSize: 12, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: "#1f1f1f",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 4,
  },
  textarea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", marginBottom: 4 },
  halfLeft: { flex: 1, marginRight: 6 },
  halfRight: { flex: 1, marginLeft: 6 },
  optionRow: { flexDirection: "row", marginBottom: 4 },
  optionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginRight: 8,
  },
  optionBtnActive: { backgroundColor: "#E50914", borderColor: "#E50914" },
  optionText: { color: "#666", fontSize: 13, fontWeight: "600" },
  optionTextActive: { color: "#fff" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  genreGrid: { flexDirection: "row", flexWrap: "wrap" },
  genreChip: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  genreChipActive: { backgroundColor: "#E50914", borderColor: "#E50914" },
  genreChipText: { color: "#666", fontSize: 13 },
  genreChipTextActive: { color: "#fff", fontWeight: "600" },
  emptyEp: { color: "#666", fontSize: 13, marginBottom: 8 },
  epItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  epInfo: { flex: 1 },
  epNum: { color: "#fff", fontWeight: "700", fontSize: 13 },
  epTitle: { color: "#888", fontSize: 12, marginTop: 2 },
  epDelete: { padding: 4 },
  addEpBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  addEpBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  bottomPad: { height: 60 },
});
