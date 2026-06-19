import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

const AUTO_DISMISS_MS = 3500;

const TOAST_STYLES: Record <
  ToastType,
  { accent: string; bg: string; icon: string }
> = {
  success: { accent: "#00C853", bg: "rgba(0,200,83,0.12)", icon: "✓" },
  error: { accent: "#E50914", bg: "rgba(229,9,20,0.12)", icon: "✕" },
  info: { accent: "#2D9CDB", bg: "rgba(45,156,219,0.12)", icon: "i" },
};
let idCounter = 0;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: Platform.OS !== "web",
        speed: 16,
        bounciness: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [translateY, opacity]);

  const animateOut = useCallback((onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start(() => onDone?.());
  }, [translateY, opacity]);

  const dismiss = useCallback(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    animateOut(() => setToast(null));
  }, [animateOut]);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      idCounter += 1;
      if (dismissTimer.current) clearTimeout(dismissTimer.current);

      setToast({ id: idCounter, type, title, message });
      translateY.setValue(-120);
      opacity.setValue(0);

      dismissTimer.current = setTimeout(() => {
        animateOut(() => setToast(null));
      }, AUTO_DISMISS_MS);
    },
    [animateOut, translateY, opacity],
  );

  useEffect(() => {
    if (toast) animateIn();
  }, [toast, animateIn]);

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  const success = useCallback(
    (title: string, message?: string) => showToast("success", title, message),
    [showToast],
  );
  const error = useCallback(
    (title: string, message?: string) => showToast("error", title, message),
    [showToast],
  );
  const info = useCallback(
    (title: string, message?: string) => showToast("info", title, message),
    [showToast],
  );

  const style = toast ? TOAST_STYLES[toast.type] : TOAST_STYLES.info;

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {toast ? (
        <Animated.View
          style={[
            styles.wrapper,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={dismiss}
            style={[
              styles.toast,
              { backgroundColor: style.bg, borderColor: style.accent },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: style.accent }]}>
              <Text style={styles.iconText}>{style.icon}</Text>
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{toast.title}</Text>
              {!!toast.message && (
                <Text style={styles.message}>{toast.message}</Text>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 24,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  toast: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: { color: "#fff", fontWeight: "900", fontSize: 13 },
  textWrap: { flex: 1 },
  title: { color: "#fff", fontWeight: "700", fontSize: 14.5 },
  message: { color: "#ddd", fontSize: 12.5, marginTop: 2 },
});