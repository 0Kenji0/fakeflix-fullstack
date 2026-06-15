import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  HeartIcon,
  HomeIcon,
  PersonIcon,
  SearchIcon,
  TimeIcon,
} from "../../components/icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#141414",
          borderTopColor: "#2a2a2a",
          borderTopWidth: 1,
          height: Platform.OS === "web" ? 60 : 80,
          paddingBottom: Platform.OS === "web" ? 8 : 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Tìm kiếm",
          tabBarIcon: ({ color, size }) => (
            <SearchIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Yêu thích",
          tabBarIcon: ({ color, size }) => (
            <HeartIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Đã xem",
          tabBarIcon: ({ color, size }) => (
            <TimeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, size }) => (
            <PersonIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
