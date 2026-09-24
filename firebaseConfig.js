import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Firebase 콘솔의 Project Settings에서 확인한 설정값
const firebaseConfig = {
  apiKey: "AIzaSyCiHD0qK-b4Ueu4iJcsIDADxERQXsMyCrE",
  authDomain: "taskup-ppark.firebaseapp.com",
  databaseURL: "https://taskup-ppark-default-rtdb.firebaseio.com",
  projectId: "taskup-ppark",
  storageBucket: "taskup-ppark.firebasestorage.app",
  messagingSenderId: "539732334961",
  appId: "1:539732334961:web:feffddbafb0e1b5d8dfed0",
};

// Firebase 앱 초기화 (Fast Refresh로 파일이 다시 실행돼도 중복 초기화 방지)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// React Native용 Auth Persistence 설정 (앱 재실행 시 로그인 유지)
/** @type {import("firebase/auth").Auth} */
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // 이미 초기화된 경우(Fast Refresh) 기존 인스턴스 사용
  auth = getAuth(app);
}

// Firestore 인스턴스 (React Native에서 연결이 불안정할 때를 대비해 long polling 자동 감지)
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export { auth, db };
