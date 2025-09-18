# 🌸 HowRU
> 간단하고 직관적인 **생리 주기 & 건강 관리 웹서비스**

HowRU는 사용자가 자신의 **생리 주기**를 기록하고,
월경기·배란기·황체기·여포기를 **자동 계산**하여 달력에 표시해주는 오프라인 퍼스트(Offline-First) 웹앱입니다.  
네트워크가 없어도 안전하게 데이터를 확인할 수 있도록 **IndexedDB**와 **Service Worker**를 활용했습니다.

---

## ✨ 주요 기능
- **주기 기록 & 자동 계산**
  - 사용자가 입력한 **월경 기간**·**주기 길이**를 기반으로
    - `월경기`: 사용자가 입력한 기간
    - `황체기`: 고정 14일
    - `배란기`: 주기 중앙 1~2일
    - `여포기`: 나머지 일수
  - 주기 길이가 달라도 계산식으로 유연 반영
- **캘린더 UI**
  - 월 단위 달력에서 각 기간을 색상별로 확인
  - 날짜 선택 시 세부 정보 표시 예정(차기 버전)
- **오프라인 퍼스트**
  - IndexedDB + Service Worker로 데이터 로컬 저장
  - 네트워크가 없어도 주기 기록/조회 가능
- **모바일 최적화 & 심플 디자인**
  - iOS Notes 앱을 참고한 **자동 저장** + **심플 인터페이스**
  - 다크 모드 지원 예정

---

## 🛠️ 기술 스택
| 구분 | 사용 기술 |
|------|-----------|
| Frontend | **React**, **TypeScript**, Vite |
| State/Storage | IndexedDB (idb), LocalStorage |
| PWA | Service Worker, Vite PWA Plugin |
| Styling | Tailwind CSS |
| Deployment | Vercel (예정) |

---

## 📂 프로젝트 구조
```bash
howru/
├─ public/              # 정적 파일, 아이콘, manifest.json
├─ src/
│  ├─ components/       # UI 컴포넌트 (NoteInput, Calendar 등)
│  ├─ hooks/            # IndexedDB, PWA 관련 커스텀 훅
│  ├─ utils/            # 주기 계산 로직
│  ├─ App.tsx
│  └─ main.tsx
├─ vite.config.ts
└─ package.json
⚡️ 시작하기
1️⃣ 환경 설정
Node.js >= 18

npm 또는 yarn

2️⃣ 설치 & 실행
bash
Copy code
# 설치
npm install

# 개발 서버 실행
npm run dev
브라우저에서 http://localhost:5173 접속

3️⃣ 빌드
bash
Copy code
npm run build
npm run preview
🧮 주기 계산 로직
ts
Copy code
// 예시: 주기 길이 = 30일, 월경기 = 5일
const luteal = 14; // 황체기 고정
const ovulation = 2; // 배란기
const follicular = cycleLength - (periodLength + luteal + ovulation);
월경기: 사용자가 입력한 기간

황체기: 14일 고정

배란기: 주기 중앙 1~2일

여포기: 남은 일수 계산

🚀 향후 계획
 증상/메모 기록 기능

 다크 모드 및 테마 지원

 차트 기반 통계 페이지

 백업/동기화 (클라우드 저장)

🤝 기여하기
Pull Request, Issue 모두 환영합니다!
버그 제보나 제안은 Issues 탭을 이용해주세요.