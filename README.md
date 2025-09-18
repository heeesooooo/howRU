# 🌸 HowRU
> 간단하고 직관적인 **생리 주기 & 건강 관리 웹서비스**

HowRU는 사용자가 자신의 **생리 주기**를 기록하고,
월경기·배란기·황체기·여포기를 **자동 계산**하여 달력에 표시해주는 오프라인 퍼스트(Offline-First) 웹앱입니다.  
네트워크가 없어도 안전하게 데이터를 확인할 수 있도록 **IndexedDB**를 활용했습니다.

---

## ✨ 주요 기능
- **주기 기록 & 자동 계산**
  - 입력한 **월경 시작일/기간**과 **주기 길이**를 기준으로 자동 계산합니다. (기준: 1일차 = 월경 시작일)
    - 월경기: 1일차부터 사용자가 입력한 월경 기간
    - 배란기: 주기 14–15일차
    - 황체기: 주기 16일차부터 주기 마지막 날
    - 여포기: 위 세 구간을 제외한 나머지 일수
  - 다양한 주기 길이도 계산식으로 유연 반영
- **캘린더 UI**
  - 월 단위 달력에서 각 기간을 색상별로 확인
  - 날짜 선택 시 세부 정보 표시 예정(차기 버전)
- **오프라인 퍼스트**
  - IndexedDB로 데이터 로컬 저장
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
| PWA | (예정) |
| Styling | Tailwind CSS |
| Deployment | Vercel (예정) |

---

## 📂 프로젝트 구조
```bash
howru/
├─ public/              # (필요 시) 정적 파일, 아이콘
├─ src/
│  ├─ components/       # UI 컴포넌트
│  ├─ utils/            # 저장/계산 유틸
│  ├─ App.tsx
│  └─ main.tsx
├─ vite.config.ts
└─ package.json
```

## ⚡️ 시작하기

### 1) 환경 설정
- Node.js >= 18

### 2) 설치 & 실행
```bash
npm install
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

### 3) 빌드 & 프리뷰
```bash
npm run build
npm run preview
# 브라우저에서 http://localhost:3000 접속
```
## 🧮 주기 계산 로직 (요약)
```ts
// 예시: 주기 길이 = 30일, 월경기 = 5일
const luteal = 14; // 예시용 값
const ovulation = 2; // 예시용 값
const follicular = cycleLength - (periodLength + luteal + ovulation);
```
현재 구현은 다음과 같이 계산합니다.
- 기준: 1일차 = 월경 시작일
- 월경기: 1일차부터 사용자가 입력한 월경 기간
- 배란기: 주기 14–15일차
- 황체기: 주기 16일차부터 주기 마지막 날
- 여포기: 위 세 구간을 제외한 나머지 일수

🚀 향후 계획
 증상/메모 기록 기능

 다크 모드 및 테마 지원

 차트 기반 통계 페이지

 백업/동기화 (클라우드 저장)

🤝 기여하기
Pull Request, Issue 모두 환영합니다!
버그 제보나 제안은 Issues 탭을 이용해주세요.