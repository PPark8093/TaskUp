import Button_X from "@/units/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../firebaseConfig";

function errorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "이메일 형식이 올바르지 않아요.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "auth/email-already-in-use":
      return "이미 가입된 이메일이에요.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상이어야 해요.";
    case "auth/network-request-failed":
      return "네트워크 연결을 확인해 주세요.";
    case "auth/too-many-requests":
      return "시도가 너무 많아요. 잠시 후 다시 해주세요.";
    default:
      return `실패했어요. (${code})`;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (mode: "login" | "signup") => {
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      // 성공하면 _layout의 Stack.Protected가 자동으로 홈 화면으로 이동시켜 줌
    } catch (e: any) {
      setError(errorMessage(e?.code ?? "unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskUp</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="rgba(222, 222, 222, 0.4)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 (6자 이상)"
          placeholderTextColor="rgba(222, 222, 222, 0.4)"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        {busy ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : (
          <View style={styles.buttons}>
            <Button_X fontSize={25} text="로그인" onPress={() => submit("login")} />
            <Button_X fontSize={25} text="회원가입" onPress={() => submit("signup")} />
          </View>
        )}
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
  form: { width: "80%", marginTop: 30, gap: 12 },
  input: {
    backgroundColor: "rgb(48, 48, 48)",
    color: "rgb(222, 222, 222)",
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
  },
  error: { color: "rgb(230, 110, 110)", fontSize: 14 },
  buttons: { alignItems: "center", marginTop: 12, gap: 8 },
});
