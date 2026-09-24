import { useAuth } from "@/lib/AuthContext";
import { DIFFICULTY_INFO, formatDate } from "@/lib/game";
import { useTasks } from "@/lib/tasks";
import { FlatList, StyleSheet, Text, View } from "react-native";

const LIGHT = "rgb(222, 222, 222)";
const DIM = "rgba(222, 222, 222, 0.5)";

export default function Completed() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks(user?.uid);

  const done = tasks
    .filter((t) => t.done)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  return (
    <View style={styles.container}>
      <FlatList
        data={done}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={
          <Text style={styles.empty}>{loading ? "불러오는 중..." : "완료한 작업이 아직 없어요."}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.meta}>
              {DIFFICULTY_INFO[item.difficulty].label} · +{item.xpReward} XP
              {item.completedAt ? ` · ${formatDate(item.completedAt)} 완료` : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(33, 33, 33)" },
  empty: { color: DIM, fontSize: 16, textAlign: "center", marginTop: 24 },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(222, 222, 222, 0.2)",
  },
  itemTitle: { color: LIGHT, fontSize: 20 },
  meta: { color: DIM, fontSize: 14, marginTop: 2 },
});
