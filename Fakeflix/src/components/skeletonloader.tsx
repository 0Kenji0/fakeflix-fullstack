import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 6, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: "#2a2a2a",
          opacity,
        },
        style,
      ]}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={130} height={195} borderRadius={8} />
      <Skeleton width={110} height={12} style={{ marginTop: 8 }} />
      <Skeleton width={60} height={10} style={{ marginTop: 4 }} />
    </View>
  );
}

export function HomeScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Banner skeleton */}
      <Skeleton width="100%" height={520} borderRadius={0} />

      {/* Section 1 */}
      <View style={styles.section}>
        <Skeleton width={140} height={18} style={{ marginBottom: 14, marginLeft: 16 }} />
        <View style={styles.row}>
          {[1, 2, 3, 4].map((i) => <MovieCardSkeleton key={i} />)}
        </View>
      </View>

      {/* Section 2 */}
      <View style={styles.section}>
        <Skeleton width={140} height={18} style={{ marginBottom: 14, marginLeft: 16 }} />
        <View style={styles.row}>
          {[1, 2, 3, 4].map((i) => <MovieCardSkeleton key={i} />)}
        </View>
      </View>
    </View>
  );
}

export function MovieDetailSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={280} borderRadius={0} />
      <View style={{ padding: 20 }}>
        <Skeleton width="70%" height={28} style={{ marginBottom: 12 }} />
        <Skeleton width="50%" height={14} style={{ marginBottom: 16 }} />
        <Skeleton width="100%" height={46} borderRadius={6} style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={14} style={{ marginBottom: 24 }} />
        <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  section: { marginBottom: 32 },
  row: { flexDirection: "row", paddingHorizontal: 16, gap: 12 },
  card: { width: 130 },
});