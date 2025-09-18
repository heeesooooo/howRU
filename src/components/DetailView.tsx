import { ArrowLeft, Heart, Activity, Coffee, Smile } from 'lucide-react';

interface DetailViewProps {
  day: number;
  onBackToCalendar: () => void;
}

export function DetailView({ day, onBackToCalendar }: DetailViewProps) {
  // 생리 주기 단계 결정
  const getCycleInfo = (day: number) => {
    if (day >= 1 && day <= 5) {
      return {
        phase: '생리 기간',
        color: 'bg-red-50 border-red-200',
        accentColor: 'text-red-600'
      };
    }
    if (day >= 6 && day <= 13) {
      return {
        phase: '여포기',
        color: 'bg-yellow-50 border-yellow-200',
        accentColor: 'text-yellow-600'
      };
    }
    if (day >= 14 && day <= 15) {
      return {
        phase: '배란기',
        color: 'bg-purple-50 border-purple-200',
        accentColor: 'text-purple-600'
      };
    }
    if (day >= 16 && day <= 28) {
      return {
        phase: '황체기',
        color: 'bg-blue-50 border-blue-200',
        accentColor: 'text-blue-600'
      };
    }
    return {
      phase: '',
      color: 'bg-gray-50 border-gray-200',
      accentColor: 'text-gray-600'
    };
  };

  // 단계별 상세 정보
  const getPhaseDetails = (day: number) => {
    if (day >= 1 && day <= 5) {
      return {
        body: '에너지↓, 민감함, 경련',
        actions: '따뜻한 찜질, 충분한 휴식',
        nutrition: '철분, 마그네슘, 따뜻한 차',
        fun: '휴식과 자기관리 시간 🌸'
      };
    }
    if (day >= 6 && day <= 13) {
      return {
        body: '에너지↑, 활발함, 집중력 상승',
        actions: '유산소 운동, 새로운 도전',
        nutrition: '단백질, 비타민B, 신선한 과일',
        fun: '활동적인 시간! 💪'
      };
    }
    if (day >= 14 && day <= 15) {
      return {
        body: '에너지 최고점, 자신감↑',
        actions: '고강도 운동, 사교 활동',
        nutrition: '항산화제, 오메가3, 견과류',
        fun: '최고의 컨디션 시기 ✨'
      };
    }
    if (day >= 16 && day <= 28) {
      return {
        body: '에너지↓, 붓기↑, 예민',
        actions: '가벼운 요가, 카페인 줄이기',
        nutrition: '마그네슘, 비타민B, 따뜻한 차',
        fun: '휴식에 좋은 시기 🌿'
      };
    }
    return {
      body: '',
      actions: '',
      nutrition: '',
      fun: ''
    };
  };

  const cycleInfo = getCycleInfo(day);
  const phaseDetails = getPhaseDetails(day);

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* 헤더 */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBackToCalendar}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-medium text-black">
              {day}일차 — {cycleInfo.phase}
            </h1>
            <p className="text-sm text-gray-500">February 2024</p>
          </div>
        </div>
      </div>

      {/* 카드 섹션 */}
      <div className="flex-1 px-6 space-y-4">
        {/* 몸 & 기분 카드 */}
        <div className={`p-4 rounded-2xl border ${cycleInfo.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <Heart className={`w-5 h-5 ${cycleInfo.accentColor}`} />
            <h3 className="font-medium text-black">몸 & 기분</h3>
          </div>
          <p className="text-gray-700">{phaseDetails.body}</p>
        </div>

        {/* 추천 행동 카드 */}
        <div className={`p-4 rounded-2xl border ${cycleInfo.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <Activity className={`w-5 h-5 ${cycleInfo.accentColor}`} />
            <h3 className="font-medium text-black">추천 행동</h3>
          </div>
          <p className="text-gray-700">{phaseDetails.actions}</p>
        </div>

        {/* 영양 & 음식 카드 */}
        <div className={`p-4 rounded-2xl border ${cycleInfo.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <Coffee className={`w-5 h-5 ${cycleInfo.accentColor}`} />
            <h3 className="font-medium text-black">영양 & 음식</h3>
          </div>
          <p className="text-gray-700">{phaseDetails.nutrition}</p>
        </div>

        {/* 재미 요소 카드 */}
        <div className={`p-4 rounded-2xl border ${cycleInfo.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <Smile className={`w-5 h-5 ${cycleInfo.accentColor}`} />
            <h3 className="font-medium text-black">오늘의 한마디</h3>
          </div>
          <p className="text-gray-700">{phaseDetails.fun}</p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-6">
        <button
          onClick={onBackToCalendar}
          className="w-full py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors"
        >
          달력으로 돌아가기
        </button>
      </div>
    </div>
  );
}