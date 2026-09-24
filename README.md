# TaskUp

> 할 일을 끝낼 때마다 경험치를 얻고 레벨이 오르는, 게임 같은 할 일 관리 앱

TaskUp은 해야 할 일을 적어두고 완료할 때마다 **경험치(XP)를 얻어 레벨을 올리는** 모바일 앱입니다.
할 일을 끝내는 순간이 곧 성장하는 순간이 되도록, 게임처럼 성취감을 느끼게 만드는 것이 목표입니다.
계정에 로그인하면 **어떤 기기에서 켜도 같은 데이터**가 실시간으로 동기화됩니다.

## 주요 기능

- **이메일/비밀번호 로그인** – 회원가입과 로그인을 지원하고, 앱을 다시 켜도 로그인이 유지됩니다.
- **작업 관리** – 제목, 난이도(쉬움/보통/어려움), 마감일(선택)을 정해 작업을 추가하고 완료·삭제할 수 있습니다.
- **경험치와 레벨** – 작업을 완료하면 난이도에 따라 경험치를 얻고, 충분히 쌓이면 레벨이 오릅니다.
- **홈 화면 스탯** – 현재 레벨과 경험치 진행도를 홈 화면에서 바로 확인할 수 있습니다.
- **기기 간 실시간 동기화** – 폰에서 추가한 작업이 태블릿에도 바로 나타납니다.
- **마감 표시** – 마감일이 지난 작업은 빨간색으로 표시됩니다.

## 화면 구성

| 화면 | 설명 |
|---|---|
| 로그인 | 이메일/비밀번호로 로그인 또는 회원가입 |
| 홈 | 레벨·경험치 요약, 각 화면으로 이동, 로그아웃 |
| 진행 중 작업 | 작업 추가, 완료, 삭제 (마감일이 빠른 순으로 정렬) |
| 진행 완료 작업 | 완료한 작업 기록 (최근 완료 순) |
| 현재 스탯 | 레벨, 경험치 바, 누적 경험치, 완료/진행 중 작업 수 |

## 경험치 규칙

| 난이도 | 획득 경험치 |
|---|---|
| 쉬움 | +10 XP |
| 보통 | +20 XP |
| 어려움 | +30 XP |

레벨 **L → L+1** 로 올라가려면 `L × 50` XP가 필요합니다. (1→2: 50, 2→3: 100, 3→4: 150 …)
규칙은 `src/lib/game.ts`에서 수정할 수 있습니다.

## 기술 스택

- [Expo](https://expo.dev) (SDK 57) / React Native / TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) – 파일 기반 라우팅
- [Firebase](https://firebase.google.com) – Authentication(이메일/비밀번호), Cloud Firestore

## 프로젝트 구조

```
TaskUp/
├─ firebaseConfig.js        # Firebase 초기화 (auth, db)
├─ firestore.rules          # Firestore 보안 규칙
├─ app.json                 # Expo 앱 설정 (아이콘, 스플래시 등)
└─ src/
   ├─ app/                  # 화면 (Expo Router)
   │  ├─ _layout.tsx        # 로그인 여부에 따른 화면 분기
   │  ├─ login.tsx
   │  ├─ index.tsx          # 홈
   │  ├─ tasks.tsx
   │  ├─ completed.tsx
   │  └─ stats.tsx
   ├─ lib/
   │  ├─ AuthContext.tsx    # 로그인 상태 관리
   │  ├─ tasks.ts           # Firestore 작업/경험치 로직
   │  └─ game.ts            # 경험치·레벨 계산
   └─ units/
      └─ Button.tsx         # 공용 버튼
```

## 데이터 구조 (Firestore)

```
users/{uid}                  { xp, completedCount }
users/{uid}/tasks/{taskId}   { title, difficulty, dueDate, done, xpReward, createdAt, completedAt }
```

작업 완료와 경험치 지급은 하나의 **트랜잭션**으로 처리되어, 여러 기기에서 동시에 눌러도 경험치가 중복 지급되지 않습니다.

## 실행 방법

### 1. 설치

```bash
npm install
```

### 2. Firebase 설정

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트를 만듭니다.
2. **Authentication → Sign-in method**에서 *이메일/비밀번호*를 활성화합니다.
3. **Firestore Database**를 생성합니다.
4. Firestore **규칙(Rules)** 탭에 `firestore.rules`의 내용을 붙여넣고 게시합니다.
5. 프로젝트 설정에서 웹 앱을 등록하고, 발급된 설정값을 `firebaseConfig.js`의 `firebaseConfig`에 넣습니다.

> Firebase 웹 설정값(apiKey 등)은 비밀키가 아니라 앱에 포함되는 식별용 값입니다.
> 데이터 보호는 **Firestore 보안 규칙**이 담당하므로 규칙을 반드시 게시하세요.

### 3. 개발 서버 실행

```bash
npx expo start
```

터미널에 표시되는 QR 코드를 폰의 **Expo Go** 앱으로 스캔하면 실행됩니다.

## APK 빌드 (Android)

[EAS Build](https://docs.expo.dev/build/introduction/)로 설치용 APK를 만들 수 있습니다.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

`eas.json`의 `preview` 프로필에 아래 설정이 필요합니다.

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

빌드가 끝나면 나오는 링크로 APK를 받아 기기에 설치합니다.
앱 아이콘과 스플래시 화면은 Expo Go에서는 바뀌지 않고, 빌드한 앱에서만 반영됩니다.

## 라이선스

[LICENSE](./LICENSE) 파일을 참고하세요.
