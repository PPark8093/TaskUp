import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { DIFFICULTY_INFO, Difficulty, getLevelInfo, Task } from "./game";

// 데이터 구조
//  users/{uid}                : { xp, completedCount }
//  users/{uid}/tasks/{taskId} : Task (id 제외)

export function addTask(
  uid: string,
  input: { title: string; difficulty: Difficulty; dueDate: string | null }
) {
  return addDoc(collection(db, "users", uid, "tasks"), {
    title: input.title,
    difficulty: input.difficulty,
    dueDate: input.dueDate,
    done: false,
    xpReward: DIFFICULTY_INFO[input.difficulty].xp,
    createdAt: Date.now(),
    completedAt: null,
  });
}

export function deleteTask(uid: string, taskId: string) {
  return deleteDoc(doc(db, "users", uid, "tasks", taskId));
}

// 작업 완료 + 경험치 지급을 하나의 트랜잭션으로 처리
// (두 기기에서 동시에 눌러도 경험치가 두 번 들어가지 않음)
export function completeTask(uid: string, taskId: string) {
  const taskRef = doc(db, "users", uid, "tasks", taskId);
  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (tx) => {
    const taskSnap = await tx.get(taskRef);
    const userSnap = await tx.get(userRef);
    if (!taskSnap.exists() || taskSnap.data().done) return null;

    const gained = (taskSnap.data().xpReward as number) ?? 0;
    const oldXp = (userSnap.data()?.xp as number) ?? 0;
    const oldCount = (userSnap.data()?.completedCount as number) ?? 0;
    const newXp = oldXp + gained;

    tx.update(taskRef, { done: true, completedAt: Date.now() });
    tx.set(userRef, { xp: newXp, completedCount: oldCount + 1 }, { merge: true });

    return {
      gained,
      oldLevel: getLevelInfo(oldXp).level,
      newLevel: getLevelInfo(newXp).level,
    };
  });
}

// 작업 목록 실시간 구독 (다른 기기에서 바꾸면 바로 반영)
export function useTasks(uid: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      collection(db, "users", uid, "tasks"),
      (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task));
        setLoading(false);
      },
      (e) => {
        console.warn("tasks listener error", e);
        setLoading(false);
      }
    );
  }, [uid]);

  return { tasks, loading };
}

// 경험치·완료 수 실시간 구독
export function useUserStats(uid: string | undefined) {
  const [stats, setStats] = useState({ xp: 0, completedCount: 0 });

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        const d = snap.data();
        setStats({ xp: d?.xp ?? 0, completedCount: d?.completedCount ?? 0 });
      },
      (e) => console.warn("stats listener error", e)
    );
  }, [uid]);

  return stats;
}
