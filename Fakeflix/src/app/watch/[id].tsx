import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

export default function WatchScreen() {
  const {
    id,
    title,
    videoUrl: paramVideoUrl,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    videoUrl: string;
  }>();

  const [videoUrl, setVideoUrl] = useState<string | null>(
    paramVideoUrl ? decodeURIComponent(paramVideoUrl) : null,
  );
  const [loading, setLoading] = useState(!paramVideoUrl);
  const [error, setError] = useState(false);
  const videoRef = useRef<any>(null);
  const saveInterval = useRef<any>(null);

  useEffect(() => {
    if (!paramVideoUrl) loadMovie();
    return () => {
      if (saveInterval.current) clearInterval(saveInterval.current);
    };
  }, [id]);

  useEffect(() => {
    if (!videoUrl) return;
    saveInterval.current = setInterval(() => {
      const el = videoRef.current;
      if (el) {
        const seconds = Math.floor(el.currentTime ?? 0);
        if (seconds > 0) {
          api
            .post(`/api/history/${id}`, null, {
              params: { watchedTime: seconds },
            })
            .catch(() => {});
        }
      }
    }, 15000);
    return () => {
      if (saveInterval.current) clearInterval(saveInterval.current);
    };
  }, [videoUrl]);

  const loadMovie = async () => {
    try {
      const res = await api.get(`/api/movies/${id}`);
      if (!res.data.videoUrl) setError(true);
      else setVideoUrl(res.data.videoUrl);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    console.log("BACK CLICKED");
    console.log("canGoBack =", router.canGoBack());

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error || !videoUrl) {
    return (
      <View style={styles.center}>
        <Ionicons name="film-outline" size={64} color="#555" />
        <Text style={styles.errorText}>Phim này chưa có video</Text>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Web: dùng HTML5 video
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backOverlay} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {!!title && (
          <Text style={styles.titleText} numberOfLines={1}>
            {decodeURIComponent(title as string)}
          </Text>
        )}
        {/* @ts-ignore */}
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            maxHeight: "calc(100vh - 80px)",
          }}
        />
      </View>
    );
  }

  // Mobile: fallback
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Vui lòng xem trên trình duyệt</Text>
      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    alignItems: "center",
  },
  backOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  titleText: {
    position: "absolute",
    top: 22,
    left: 60,
    right: 16,
    zIndex: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: { color: "#999", fontSize: 16, marginTop: 16, marginBottom: 16 },
  backBtn: {
    backgroundColor: "#E50914",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: { color: "#fff", fontWeight: "bold" },
});
