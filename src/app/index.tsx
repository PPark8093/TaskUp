import { useAuth } from "@/lib/AuthContext";
import { getLevelInfo } from "@/lib/game";
import { useUserStats } from "@/lib/tasks";
import Button_X from "@/units/Button";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { xp } = useUserStats(user?.uid);
  const { level, xpInto, xpNeeded } = getLevelInfo(xp);
  const pct = Math.min(100, (xpInto / xpNeeded) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskUp</Text>

      {/* 현재 스탯 요약 */}
      <View style={styles.stats}>
        <Text style={styles.level}>Lv.{level}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.xp}>
          {xpInto} / {xpNeeded} XP
        </Text>
      </View>

      <View style={styles.inner_container}>
        <Button_X
          fontSize={25}
          text="진행 중 작업"
          onPress={() => router.push("/tasks")}
        />
        <Button_X
          fontSize={25}
          text="진행 완료 작업"
          onPress={() => router.push("/completed")}
        />
        <Button_X
          fontSize={25}
          text="현재 스탯"
          onPress={() => router.push("/stats")}
        />
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
  stats: {
    width: "60%",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  level: { fontSize: 32, fontWeight: "700", color: "rgb(222, 222, 222)" },
  track: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgb(55, 55, 55)",
    marginTop: 8,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "rgb(222, 222, 222)" },
  xp: { fontSize: 14, marginTop: 6, color: "rgba(222, 222, 222, 0.5)" },
  inner_container: {
    alignItems: "center",
    justifyContent: "center",
    gap: "10%",
  },
  logout: { position: "absolute", bottom: "8%" },
});
