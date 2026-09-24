import { useAuth } from "@/lib/AuthContext";
import { DIFFICULTY_INFO, Difficulty, Task, formatDate, isValidDate } from "@/lib/game";
import { addTask, completeTask, deleteTask, useTasks } from "@/lib/tasks";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LIGHT = "rgb(222, 222, 222)";
const DIM = "rgba(222, 222, 222, 0.5)";

export default function Tasks() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { tasks, loading } = useTasks(uid);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [due, setDue] = useState("");

  // 마감일 빠른 순(없으면 뒤로), 같으면 먼저 만든 순
  const pending = tasks
    .filter((t) => !t.done)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      return a.createdAt - b.createdAt;
    });

  const today = formatDate(Date.now());

  const onAdd = () => {
    if (!uid) return;
    const t = title.trim();
    const d = due.trim();
    if (!t) return Alert.alert("작업 이름을 입력해 주세요.");
    if (d && !isValidDate(d)) return Alert.alert("마감일은 2026-12-31 같은 형식으로 입력해 주세요.");
    addTask(uid, { title: t, difficulty, dueDate: d || null }).catch((e) =>
      Alert.alert("추가 실패", String(e))
    );
    setTitle("");
    setDue("");
  };

  const onComplete = async (task: Task) => {
    if (!uid) return;
    try {
      const r = await completeTask(uid, task.id);
      if (!r) return;
      if (r.newLevel > r.oldLevel) {
        Alert.alert("레벨 업!", `Lv.${r.newLevel} 달성! (+${r.gained} XP)`);
      } else {
        Alert.alert("작업 완료!", `+${r.gained} XP`);
      }
    } catch (e) {
      Alert.alert("완료 처리 실패", String(e));
    }
  };

  const onDelete = (task: Task) => {
    if (!uid) return;
    Alert.alert("작업 삭제", `"${task.title}" 작업을 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => deleteTask(uid, task.id).catch((e) => Alert.alert("삭제 실패", String(e))),
      },
    ]);
  };

  const form = (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="해야 할 일"
        placeholderTextColor="rgba(222, 222, 222, 0.4)"
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.row}>
        {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((k) => (
          <TouchableOpacity key={k} onPress={() => setDifficulty(k)}>
            <Text style={[styles.chip, difficulty === k && styles.chipOn]}>
              {DIFFICULTY_INFO[k].label} +{DIFFICULTY_INFO[k].xp}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="마감일 (선택, 예: 2026-12-31)"
        placeholderTextColor="rgba(222, 222, 222, 0.4)"
        keyboardType="numbers-and-punctuation"
        value={due}
        onChangeText={setDue}
      />
      <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
        <Text style={styles.addText}>작업 추가</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pending}
        keyExtractor={(t) => t.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={form}
        ListEmptyComponent={
          <Text style={styles.empty}>{loading ? "불러오는 중..." : "진행 중인 작업이 없어요."}</Text>
        }
        renderItem={({ item }) => {
          const overdue = !!item.dueDate && item.dueDate < today;
          return (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={[styles.meta, overdue && styles.overdue]}>
                  {DIFFICULTY_INFO[item.difficulty].label} · +{item.xpReward} XP
                  {item.dueDate ? ` · 마감 ${item.dueDate}${overdue ? " (지남)" : ""}` : ""}
                </Text>
              </View>
              <TouchableOpacity onPress={() => onComplete(item)}>
                <Text style={styles.action}>완료</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item)}>
                <Text style={styles.action}>삭제</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgb(33, 33, 33)" },
  form: { padding: 16, gap: 12 },
  input: {
    backgroundColor: "rgb(48, 48, 48)",
    color: LIGHT,
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
  },
  row: { flexDirection: "row", gap: 16 },
  chip: { fontSize: 16, color: DIM },
  chipOn: { color: LIGHT, fontWeight: "700" },
  addBtn: { alignSelf: "flex-start", paddingVertical: 4 },
  addText: { fontSize: 20, color: LIGHT, fontWeight: "700" },
  empty: { color: DIM, fontSize: 16, textAlign: "center", marginTop: 24 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(222, 222, 222, 0.2)",
  },
  itemTitle: { color: LIGHT, fontSize: 20 },
  meta: { color: DIM, fontSize: 14, marginTop: 2 },
  overdue: { color: "rgb(230, 110, 110)" },
  action: { color: DIM, fontSize: 18 },
});
