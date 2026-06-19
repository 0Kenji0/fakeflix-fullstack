import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let isHandlerSet = false;

function ensureHandler() {
  if (isHandlerSet) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  isHandlerSet = true;
}

/**
 * Xin quyền gửi thông báo. Trả về true nếu được phép.
 * An toàn để gọi trên mọi platform — tự bỏ qua khi không hỗ trợ (ví dụ web
 * trên một số trình duyệt, hoặc môi trường không cấp quyền).
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    ensureHandler();

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (e) {
    console.warn("Không thể xin quyền thông báo:", e);
    return false;
  }
}

/**
 * Gửi một push notification cục bộ ngay lập tức (hiển thị ở khay thông báo
 * thiết bị). Dùng cho các sự kiện như "Đăng ký thành công".
 * Không bao giờ throw — nếu thất bại (thiếu quyền, không hỗ trợ trên
 * platform hiện tại...) sẽ chỉ log cảnh báo, không ảnh hưởng luồng chính.
 */
export async function sendLocalNotification(title: string, body: string) {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // null = hiển thị ngay
    });
  } catch (e) {
    console.warn("Không thể gửi thông báo cục bộ:", e);
  }
}

/**
 * Lấy Expo Push Token của thiết bị — dùng nếu sau này muốn gửi push
 * notification từ backend (qua Expo Push API) thay vì local notification.
 * Yêu cầu chạy trên thiết bị thật (không phải simulator) và một
 * development build (không hoạt động trong Expo Go từ SDK 53 trở đi).
 */
export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  try {
    const granted = await requestNotificationPermission();
    if (!granted) return null;

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return tokenResponse.data;
  } catch (e) {
    console.warn("Không thể lấy Expo push token:", e);
    return null;
  }
}import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let isHandlerSet = false;

function ensureHandler() {
  if (isHandlerSet) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  isHandlerSet = true;
}

/**
 * Xin quyền gửi thông báo. Trả về true nếu được phép.
 * An toàn để gọi trên mọi platform — tự bỏ qua khi không hỗ trợ (ví dụ web
 * trên một số trình duyệt, hoặc môi trường không cấp quyền).
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    ensureHandler();

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (e) {
    console.warn("Không thể xin quyền thông báo:", e);
    return false;
  }
}

/**
 * Gửi một push notification cục bộ ngay lập tức (hiển thị ở khay thông báo
 * thiết bị). Dùng cho các sự kiện như "Đăng ký thành công".
 * Không bao giờ throw — nếu thất bại (thiếu quyền, không hỗ trợ trên
 * platform hiện tại...) sẽ chỉ log cảnh báo, không ảnh hưởng luồng chính.
 */
export async function sendLocalNotification(title: string, body: string) {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // null = hiển thị ngay
    });
  } catch (e) {
    console.warn("Không thể gửi thông báo cục bộ:", e);
  }
}

/**
 * Lấy Expo Push Token của thiết bị — dùng nếu sau này muốn gửi push
 * notification từ backend (qua Expo Push API) thay vì local notification.
 * Yêu cầu chạy trên thiết bị thật (không phải simulator) và một
 * development build (không hoạt động trong Expo Go từ SDK 53 trở đi).
 */
export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  try {
    const granted = await requestNotificationPermission();
    if (!granted) return null;

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return tokenResponse.data;
  } catch (e) {
    console.warn("Không thể lấy Expo push token:", e);
    return null;
  }
}