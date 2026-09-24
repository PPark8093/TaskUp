import { useAuth } from "@/lib/AuthContext";
import { getLevelInfo } from "@/lib/game";
import { useTasks, useUserStats } from "@/lib/tasks";
import { StyleSheet, Text, View } from "react-native";

const LIGHT = "rgb(222, 222, 222)";
const DIM = "rgba(222, 222, 222, 0.5)";

export default function Stats() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { xp, completedCount } = useUserStats(uid);
  const { tasks } = useTasks(uid);

  const { level, xpInto, xpNeeded } = getLevelInfo(xp);
  const pct = Math.min(100, (xpInto / xpNeeded) * 100);
  const pendingCount = tasks.filter((t) => !t.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.level}>Lv.{level}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.xp}>
        {xpInto} / {xpNeeded} XP
      </Text>
      <Text style={styles.sub}>다음 레벨까지 {xpNeeded - xpInto} XP</Text>

      <View style={styles.summary}>
        <Text style={styles.line}>누적 경험치: {xp} XP</Text>
        <Text style={styles.line}>완료한 작업: {completedCount}개</Text>
        <Text style={styles.line}>진행 중인 작업: {pendingCount}개</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 32,
    backgroundColor: "rgb(33, 33, 33)",
  },
  level: { fontSize: 56, fontWeight: "700", color: LIGHT },
  track: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgb(55, 55, 55)",
    marginTop: 16,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: LIGHT },
  xp: { color: LIGHT, fontSize: 18, marginTop: 10 },
  sub: { color: DIM, fontSize: 14, marginTop: 4 },
  summary: { alignSelf: "flex-start", marginTop: 48, gap: 8 },
  line: { color: LIGHT, fontSize: 20 },
});
