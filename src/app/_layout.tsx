import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const BG = "rgb(33, 33, 33)";

const subScreen = {
  headerShown: true,
  headerStyle: { backgroundColor: BG },
  headerTintColor: "rgb(222, 222, 222)",
  headerShadowVisible: false,
} as const;

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: BG }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: BG } }}>
      {/* 로그인한 경우에만 접근 가능한 화면 */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tasks" options={{ ...subScreen, title: "진행 중 작업" }} />
        <Stack.Screen name="completed" options={{ ...subScreen, title: "진행 완료 작업" }} />
        <Stack.Screen name="stats" options={{ ...subScreen, title: "현재 스탯" }} />
      </Stack.Protected>
      {/* 로그인하지 않은 경우에만 접근 가능한 화면 */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
