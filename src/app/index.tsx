import { useAuth } from "@/lib/AuthContext";
import Button_X from "@/units/Button";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskUp</Text>
      <View style={styles.inner_container}>
        <Button_X fontSize={25} text="진행 중 작업" onPress={() => router.push("/tasks")} />
        <Button_X fontSize={25} text="진행 완료 작업" onPress={() => router.push("/completed")} />
        <Button_X fontSize={25} text="현재 스탯" onPress={() => router.push("/stats")} />
      </View>
      <View style={styles.logout}>
        <Button_X fontSize={16} text="로그아웃" onPress={() => logout()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(33, 33, 33)",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    position: "absolute",
    top: "12%",
    color: "rgb(222, 222, 222)",
  },
  inner_container: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: "10%",
  },
  logout: { position: "absolute", bottom: "8%" },
});
