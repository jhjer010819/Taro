export const site = {
  name: "타로",
  domain: "taro.mymallow.cloud",
  url: "https://taro.mymallow.cloud",
  tagline: "심심하면 뇌 끄는 테스트장",
}

export const tags = [
  { id: "power", label: "병맛전투력" },
  { id: "trend", label: "트렌드분석" },
  { id: "bored", label: "심심풀이" },
  { id: "people", label: "인간관계" },
  { id: "food", label: "음식" },
  { id: "work", label: "직장" },
]

export const quizzes = [
  {
    id: "power",
    kind: "quiz",
    title: "오늘의 병맛 전투력",
    emoji: "💥",
    blurb: "알람, 단톡, 편의점. 세 장면이면 오늘 전투력은 나온다.",
    tags: ["power", "bored"],
    hot: 184320,
    published: "2026-11-09",
    questions: [
      {
        q: "아침 알람이 세 번째로 울렸다.",
        a: "손만 밖으로 내보내 snooze를 누른다. 눈은 아직 폐관이다.",
        b: "알람보다 일찍 눈이 떠져서, 괜히 성실한 척 천장을 본다.",
      },
      {
        q: "단톡에 「다들 뭐함?」이 도착했다.",
        a: "읽고 화면을 뒤집는다. 답장은 미래에서 온다.",
        b: "「나 밥 먹는 중」을 보내고, 메뉴는 그 다음에 정한다.",
      },
      {
        q: "편의점 냉장고 앞에서 손이 멈췄다.",
        a: "삼각김밥이랑 눈이 마주쳐 둘을 함께 집는다.",
        b: "프로틴 바를 들며 혼잣말한다. 오늘부터 진짜.",
      },
    ],
    results: [
      {
        id: "blanket",
        score: 0,
        title: "이불 요정",
        meter: "전투력 3",
        summary:
          "오늘은 싸우지 않기로 한 날이다. 알람은 배경음이고, 단톡은 읽기 전용 방송이며, 야식은 감정 조절 장치다. 전투력은 낮아 보이지만 이불 점유율은 최상이다.",
        comment: "이 결과를 공유하면 친구들이 너를 깨우지 않는다. 전략적으로 옳다.",
      },
      {
        id: "ninja",
        score: 1,
        title: "잠복 닌자",
        meter: "전투력 47",
        summary:
          "존재감은 흐리고 판단은 빠르다. 말수는 적은데 편의점에서는 본능이 정확하고, 단톡은 조용히 다 읽고 있다. 조용한 날이 오히려 위험한 타입이다.",
        comment: "사람들이 지칠 때쯤 ㅋㅋ 하나로 판을 정리한다.",
      },
      {
        id: "cosplay",
        score: 2,
        title: "갓생 코스프레",
        meter: "전투력 82",
        summary:
          "세 장면 중 둘은 성실했다. 나머지 하나가 본심이다. 그 구멍 때문에 사람이 되고, 그 구멍 때문에 결과가 웃기다.",
        comment: "스토리에는 프로틴, 봉투에는 김밥일 수 있다. 둘 다 너다.",
      },
      {
        id: "emperor",
        score: 3,
        title: "혼돈의 편의점 황제",
        meter: "전투력 999",
        summary:
          "알람을 이기고 단톡을 선점하고 냉장고 앞에서도 안 흔들렸다. 문제는 이 컨디션에 유통기한이 있다는 점이다. 오늘은 황제, 내일 아침은 이불 속 망명 정부다.",
        comment: "이 결과, 혼자 보면 외롭다. 단톡에 던져라.",
      },
    ],
  },
  {
    id: "reply",
    kind: "quiz",
    title: "카톡 답장 속도로 보는 본성",
    emoji: "💬",
    blurb: "호감, 엄마, 안 읽은 99+. 엄지 속도가 성격이라고 우기는 테스트.",
    tags: ["people", "trend"],
    hot: 151900,
    published: "2026-11-03",
    questions: [
      {
        q: "신경 쓰이는 사람이 「뭐해?」를 보냈다.",
        a: "답장 창을 열어 두고 문장을 식힌다. 바로 보내면 진 것 같다.",
        b: "본 순간 보낸다. 오타는 인간미라고 주장할 준비가 되어 있다.",
      },
      {
        q: "엄마에게서 「밥은 먹었니」가 왔다.",
        a: "「먹었어」를 먼저 보내고, 식사는 그 뒤에 성립시킨다.",
        b: "그릇을 찍어 첨부한다. 증거 없이 끝나는 대화는 불안하다.",
      },
      {
        q: "단톡 안 읽은 숫자가 99+다.",
        a: "멘션만 건지고 나머지는 고대 유물로 분류한다.",
        b: "처음부터 읽고 「정리하면」으로 회의를 소집한다.",
      },
    ],
    results: [
      {
        id: "submarine",
        score: 0,
        title: "잠수함 함장",
        meter: "답장 속도 잠항",
        summary:
          "엄지는 전략 자산이다. 보내기 버튼은 최후에만 쓴다. 읽씹은 무례가 아니라 잠수함의 정숙 운항이다.",
        comment: "상대가 답답해할 때쯤 완벽한 문장이 도착한다. 늦지만 폼은 난다.",
      },
      {
        id: "timer",
        score: 1,
        title: "눈치형 타이머",
        meter: "답장 속도 변속",
        summary:
          "사람마다 속도가 다르다. 어떤 대화는 숙성하고, 어떤 대화는 즉시 항복한다. 일관성은 없지만 생존율은 높다.",
        comment: "엄마 카톡만 빠른 사람도 여기 온다. 너는 알고 있다.",
      },
      {
        id: "booster",
        score: 2,
        title: "답장 추진체",
        meter: "답장 속도 과속",
        summary:
          "관계는 속도라고 믿는다. 답이 빨라서 편한 사람이고, 가끔은 상대의 준비 운동을 생략시킨다.",
        comment: "읽자마자 답 오는 친구 포지션. 단톡의 소방차다.",
      },
      {
        id: "siren",
        score: 3,
        title: "알림 재난경보기",
        meter: "답장 속도 광속",
        summary:
          "배지가 빨간 채로 못 잔다. 99+는 재난이고 너는 현장 지휘관이다. 정리력은 축복이자 단톡의 민폐 직전이다.",
        comment: "친구가 너한테 단톡 정리를 맡긴다. 급여는 없다.",
      },
    ],
  },
  {
    id: "lunch",
    kind: "quiz",
    title: "오늘 점심 결정장애",
    emoji: "🍜",
    blurb: "「아무거나」가 가장 잔인한 말인 사람을 위한 점심 진단.",
    tags: ["food", "bored"],
    hot: 121500,
    published: "2026-11-08",
    questions: [
      {
        q: "12시, 동료가 묻는다. 「점심 뭐 먹지?」",
        a: "「아무거나」라고 말하며, 아무거나의 목록을 마음속으로 지운다.",
        b: "저장해 둔 맛집을 이미 공유 직전이다.",
      },
      {
        q: "후보가 두 개로 줄었다.",
        a: "하나를 고르고도 다른 쪽 시뮬레이션을 돌린다.",
        b: "줄이 짧은 쪽으로 간다. 배고픔이 철학을 이긴다.",
      },
      {
        q: "밥을 다 먹었다. 입에서 나오는 말.",
        a: "배는 불렀는데 마음은 다른 메뉴에 남았다.",
        b: "「내일도 여기」라고 해놓고, 내일 또 이 테스트를 연다.",
      },
    ],
    results: [
      {
        id: "refugee",
        score: 0,
        title: "메뉴 난민",
        meter: "결정장애 99%",
        summary:
          "아무거나의 범위를 좁히다 점심시간이 끝난다. 배는 고파도 취향은 엄격하다.",
        comment: "같이 밥 먹는 사람이 먼저 지친다. 메뉴판을 넘겨라.",
      },
      {
        id: "regret",
        score: 1,
        title: "후회 예약자",
        meter: "결정장애 70%",
        summary:
          "고르긴 한다. 다만 고른 직후부터 반대 선택지의 팬이 된다. 점심은 먹고, 미련은 디저트다.",
        comment: "「그거 먹을걸」은 너의 식후경이다.",
      },
      {
        id: "queue",
        score: 2,
        title: "줄 짧은 실전파",
        meter: "결정장애 28%",
        summary:
          "고민은 하되 배가 최종 결재권을 갖는다. 맛보다 대기 시간이 오늘의 평가 기준이다.",
        comment: "친구들은 너랑 밥 먹기를 편해한다. 귀한 능력이다.",
      },
      {
        id: "dictator",
        score: 3,
        title: "점심 독재자",
        meter: "결정장애 4%",
        summary:
          "후보를 들고 오고, 장소를 정하고, 사람들의 「아무거나」를 구원한다. 내일도 독재는 갱신된다.",
        comment: "단톡에 이 결과를 올리면 내일 점심 예약이 들어온다.",
      },
    ],
  },
  {
    id: "quit",
    kind: "quiz",
    title: "퇴사각 측정기",
    emoji: "🚪",
    blurb: "월요일 알림, 아이디어 타임, 퇴근 10분 전. 회사와 너의 거리.",
    tags: ["work", "power"],
    hot: 87600,
    published: "2026-10-28",
    questions: [
      {
        q: "월요일, 업무 알림이 먼저 도착했다.",
        a: "커피를 내리는 동안은 읽지 않은 척한다.",
        b: "「확인했습니다」가 손가락에 저장되어 있다.",
      },
      {
        q: "회의에서 「아이디어 있으신 분?」",
        a: "창밖 구름의 이동을 열심히 분석한다.",
        b: "침묵이 길어서 입을 연다. 회의록에 이름이 남는다.",
      },
      {
        q: "퇴근 10분 전이다.",
        a: "가방끈은 이미 어깨에 올라가 있다.",
        b: "「이것만」이 야근의 입구인 줄 알면서 들어간다.",
      },
    ],
    results: [
      {
        id: "exile",
        score: 0,
        title: "마음만 퇴사",
        meter: "퇴사각 97%",
        summary:
          "몸은 책상 앞, 영혼은 이미 퇴근 도장을 찍었다. 알림은 읽고, 대답은 내일의 나에게 위임한다.",
        comment: "이 결과 공유는 업무 단톡이 아니라 친한 단톡에만.",
      },
      {
        id: "ghost",
        score: 1,
        title: "회의실 투명인간",
        meter: "퇴사각 64%",
        summary:
          "버틴다. 다만 존재감은 선택적으로 끈다. 구름 관찰은 생존 기술이고, 가방은 언제나 준비 완료다.",
        comment: "조용히 잘하는 사람일 수도 있다. 오늘은 측정기가 그렇게 안 본다.",
      },
      {
        id: "mule",
        score: 2,
        title: "책임감 과부하",
        meter: "퇴사각 31%",
        summary:
          "입이 열리고, 일이 붙고, 「이것만」이 쌓인다. 성실이 취미가 된 사람. 휴가는 계획표에만 있다.",
        comment: "동료들이 너를 찾는다. 너는 이미 알고 있고, 그래서 더 남는다.",
      },
      {
        id: "married",
        score: 3,
        title: "회사와 사실혼",
        meter: "퇴사각 6%",
        summary:
          "확인은 빠르고, 아이디어는 내고, 퇴근은 유동적이다. 사원증이 거의 가족관계증명서다.",
        comment: "주말에 이 결과를 받았다면, 일단 폰을 내려놓아라.",
      },
    ],
  },
  {
    id: "group",
    kind: "quiz",
    title: "단톡방 포지션",
    emoji: "👥",
    blurb: "ㅋㅋ, 이모지, 투표 만들기. 말 안 해도 자리는 정해져 있다.",
    tags: ["people", "bored"],
    hot: 134800,
    published: "2026-11-05",
    questions: [
      {
        q: "재밌는 링크가 올라왔다.",
        a: "ㅋㅋㅋ 세 개. 이것이 나의 비평 전문이다.",
        b: "요약하고 「근데 이건 좀 다르지 않냐」로 토론을 연다.",
      },
      {
        q: "여행 사진이 올라왔다.",
        a: "하트, 박수, 불꽃을 순서대로 폭격한다.",
        b: "「구도는 좋은데 하늘이 아쉽다」가 먼저 나온다.",
      },
      {
        q: "약속 장소가 안 모인다.",
        a: "「난 다 좋아」 후 확정 문자만 저장한다.",
        b: "투표를 만들고 마감 시각을 굵게 적는다.",
      },
    ],
    results: [
      {
        id: "kk",
        score: 0,
        title: "ㅋㅋ 요정",
        meter: "발언 지분 8%",
        summary:
          "말은 짧고 온도는 높다. ㅋㅋㅋ 하나로 참석 의사를 증명한다. 토론이 길어지면 조용히 스크롤만 내린다.",
        comment: "단톡이 무거운 날, 너의 ㅋㅋ이 환기다.",
      },
      {
        id: "emoji",
        score: 1,
        title: "리액션 장관",
        meter: "발언 지분 27%",
        summary:
          "문장보다 이모지가 모국어다. 사진은 받아 주고, 장소는 따라간다. 없으면 단톡이 건조해진다.",
        comment: "이모지 예산이 나라 예산보다 많다.",
      },
      {
        id: "spark",
        score: 2,
        title: "토론 점화기",
        meter: "발언 지분 63%",
        summary:
          "링크 하나로 세미나를 연다. 사진에도 평이 붙는다. 악의는 없는데 댓글이 길다.",
        comment: "친구들은 너를 읽고, 반박하고, 또 너를 멘션한다.",
      },
      {
        id: "captain",
        score: 3,
        title: "단톡 반장",
        meter: "발언 지분 91%",
        summary:
          "투표, 마감, 장소, 정산 예고. 아무도 안 맡는 자리를 네가 맡는다. 감사는 이모지로 받는다.",
        comment: "이번 주 약속, 이미 네가 만들 것이다.",
      },
    ],
  },
  {
    id: "weekend",
    kind: "quiz",
    title: "주말 계획 현실 검증",
    emoji: "🛏️",
    blurb: "금요일의 나와 토요일 11시의 나는 타인일 수 있다.",
    tags: ["bored", "trend"],
    hot: 110200,
    published: "2026-11-07",
    questions: [
      {
        q: "금요일 밤, 주말 계획을 적는다.",
        a: "달력에 「숨 쉬기」만 적는다. 빈칸이 완성본이다.",
        b: "브런치, 전시, 러닝. 사람의 주말 밀도가 맞는지 의심스럽다.",
      },
      {
        q: "토요일 낮 11시, 너의 위치.",
        a: "이불 국립공원의 깊은 구역.",
        b: "이미 밖이다. 보조배터리를 가방에서 찾는 중이다.",
      },
      {
        q: "일요일 저녁의 한마디.",
        a: "「주말이 왜 이렇게 짧지」를 천장에게 말한다.",
        b: "다음 주 루틴을 적는다. 지난주 메모는 아직 안 열렸다.",
      },
    ],
    results: [
      {
        id: "duvet",
        score: 0,
        title: "이불 국가대표",
        meter: "이행률 3%",
        summary:
          "계획은 수면이다. 수면도 계획대로 된다. 드문 성취다. 일요일 저녁의 아쉬움만 규칙적으로 출석한다.",
        comment: "이 결과, 이불 속에서 공유해도 인정된다.",
      },
      {
        id: "memo",
        score: 1,
        title: "메모만 프로",
        meter: "이행률 24%",
        summary:
          "금요일의 너는 기획자고 토요일의 너는 청중이다. 메모는 쌓이고 운동화는 현관을 지킨다.",
        comment: "다음 주도 같은 메모를 쓸 것이다. 그게 전통이다.",
      },
      {
        id: "half",
        score: 2,
        title: "반쪽 외출",
        meter: "이행률 58%",
        summary:
          "나간다. 다만 계획의 절반에서 귀가한다. 인증은 남고 러닝은 다음으로 이월된다.",
        comment: "사진은 있는데 단계는 부족하다. 그래도 밖은 봤다.",
      },
      {
        id: "packed",
        score: 3,
        title: "주말 과적",
        meter: "이행률 91%",
        summary:
          "일정이 짐칸을 넘친다. 쉬는 날의 생산성이 평일을 이긴다. 일요일 메모는 다음 주를 이미 고용했다.",
        comment: "친구를 부르기 전에 일정 사이를 재라. 사람이 들어갈 틈이 없다.",
      },
    ],
  },
  {
    id: "trend",
    kind: "quiz",
    title: "이번 달 뇌절 유형",
    emoji: "📈",
    blurb: "숏폼, 유행어, 팝업. 알고리즘과 너의 거리를 잰다.",
    tags: ["trend", "bored"],
    hot: 99010,
    published: "2026-11-10",
    questions: [
      {
        q: "숏폼을 하나만 보려 했다.",
        a: "엄지가 다음을 누른다. 나는 목격자다.",
        b: "저장 폴더가 이미 「나중에 볼 것 / 절대 안 볼 것」으로 나뉘어 있다.",
      },
      {
        q: "친구가 요즘 유행이라는 말을 썼다.",
        a: "뜻은 나중에 검색한다. 표정부터 맞춘다.",
        b: "뜻을 물어보고, 그 말로 바로 대답한다.",
      },
      {
        q: "모두가 간다는 팝업이 열렸다.",
        a: "사진이 피드에 넘치면 간 것으로 처리한다.",
        b: "가서 줄의 길이를 직접 확인하고 현장 중계한다.",
      },
    ],
    results: [
      {
        id: "watcher",
        score: 0,
        title: "유행 구경꾼",
        meter: "동화율 9%",
        summary:
          "유행이 식으면 그때 입문한다. 숏폼은 보고, 참여는 안 한다. 알고리즘 입장에서는 관객이고, 친구 입장에서는 나중에 아는 사람이다.",
        comment: "한 달 뒤에 「그거 아직 함?」이라고 묻는다.",
      },
      {
        id: "lag",
        score: 1,
        title: "검색은 내일",
        meter: "동화율 36%",
        summary:
          "표정은 빠르고 검색은 늦다. 대화는 따라가는데 저장 버튼은 아낀다. 유행의 가장자리에서 균형을 잡는다.",
        comment: "뜻은 모르는데 리액션은 정확하다. 재능이다.",
      },
      {
        id: "sync",
        score: 2,
        title: "즉시 동화",
        meter: "동화율 71%",
        summary:
          "유행어의 유통기한이 너의 하루와 같다. 친구들이 한 박자 늦는 사이 너는 이미 다음 말을 가져온다.",
        comment: "단톡 어휘를 네가 업데이트한다. 패치 노트는 없다.",
      },
      {
        id: "field",
        score: 3,
        title: "현장 검증단",
        meter: "동화율 96%",
        summary:
          "저장만으로는 직성이 안 풀린다. 팝업의 줄, 메뉴의 양, 화제의 온도를 직접 재고 돌아온다. 리뷰가 본업처럼 보인다.",
        comment: "「별로였음」이 애정이다. 친구들은 그 한 줄을 기다린다.",
      },
    ],
  },
  {
    id: "snack-cup",
    kind: "worldcup",
    title: "편의점 야식 이상형 월드컵",
    emoji: "🏆",
    blurb: "8강 고정 대진. 더 당기는 쪽을 찍으면 야식 영혼이 나온다.",
    tags: ["food", "bored"],
    hot: 162400,
    published: "2026-11-11",
    fighters: [
      {
        id: "kimbap",
        emoji: "🍙",
        name: "참치김밥",
        tease: "말아서 해결하는 고전",
        title: "참치김밥 원리주의자",
        meter: "야식 영혼 확정",
        summary:
          "양념 비율을 믿고, 복잡한 하루도 김으로 감싸면 된다고 생각한다. 신메뉴 앞에서 「원래 먹던 거」를 집는 타입이다.",
        comment: "친구 추천은 들어 주고, 계산대에서는 참치김밥이다.",
      },
      {
        id: "ramyeon",
        emoji: "🍜",
        name: "컵라면",
        tease: "면 익는 3분이 오늘 유일의 정확함",
        title: "뚜껑 반만 여는 사람",
        meter: "야식 영혼 확정",
        summary:
          "대기 시간이 정확한 음식을 고른다. 3분은 지킬 수 있는 약속이다. 뜨거운 김 속에서 오늘 일을 대충 정리한다.",
        comment: "면이 불어 있으면 하루도 좀 불어 있던 날이다.",
      },
      {
        id: "hotbar",
        emoji: "🧀",
        name: "치즈핫바",
        tease: "30초의 도박",
        title: "전자레인지 30초 도박사",
        meter: "야식 영혼 확정",
        summary:
          "덜 돌리면 차갑고 더 돌리면 용암이다. 그 경계를 일부러 산다. 즉흥은 있는데 한계 시간은 본다.",
        comment: "인생도 30초만 더, 를 자주 말한다. 가끔 탄다.",
      },
      {
        id: "cone",
        emoji: "🍦",
        name: "월드콘",
        tease: "저녁을 디저트로 대체",
        title: "냉동고 직진러",
        meter: "야식 영혼 확정",
        summary:
          "식사와 디저트의 경계를 인정하지 않는다. 냉동고 문을 여는 순간 고민은 끝이다. 차가워야 머리가 정리되는 타입이다.",
        comment: "겨울에도 이 결과를 받으면, 너는 이미 알고 있던 것이다.",
      },
      {
        id: "beer",
        emoji: "🍺",
        name: "캔맥주",
        tease: "하나는 외로워서",
        title: "캔 하나 망설임",
        meter: "야식 영혼 확정",
        summary:
          "계산대 앞에서 0.5초 멈춘다. 둘은 내일이 걱정되고, 영은 오늘이 아쉽다. 결론은 보통 하나. 땅콩은 같이 온다.",
        comment: "혼맥이 아니라 혼정산이다. 내일의 나에게 사과는 짧다.",
      },
      {
        id: "chip",
        emoji: "🍯",
        name: "허니버터칩",
        tease: "손이 먼저 노래지는 단짠",
        title: "봉지 소리의 주인공",
        meter: "야식 영혼 확정",
        summary:
          "단짠이 세계관이다. 봉지를 조용히 못 연다. 손끝이 노란 채로 오늘 기분을 설명한다.",
        comment: "단톡에 이 결과를 올리면 누가 봉지를 사 온다.",
      },
      {
        id: "egg",
        emoji: "🥚",
        name: "계란 두 알",
        tease: "배고픔을 감정으로 안 착각함",
        title: "현실 보충제",
        meter: "야식 영혼 확정",
        summary:
          "화려한 야식 사이에서 계란을 집는다. 배고픔과 감정을 분리하는 드문 타입이다. 소금은 취향이고 허세는 아니다.",
        comment: "친구가 컵라면을 살 때 너는 계란을 건넨다. 그게 정이다.",
      },
      {
        id: "buldak",
        emoji: "🌶️",
        name: "불닭볶음면",
        tease: "매운 걸로 오늘을 내보냄",
        title: "매운맛 정복자",
        meter: "야식 영혼 확정",
        summary:
          "눈물이 나와도 포크가 안 멈춘다. 오늘 쌓인 것을 캡사이신으로 배출한다. 물은 자존심 상해서 늦게 마신다.",
        comment: "이 결과를 받은 날의 내일 아침은 조금 후회한다. 그래도 또 고른다.",
      },
    ],
  },
]

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function resultsOf(quiz) {
  return quiz.kind === "worldcup" ? quiz.fighters : quiz.results
}

export function quizHref(quiz) {
  return `/quiz/quiz-${quiz.id}.html`
}

export function resultHref(quiz, result) {
  return `/result/result-${quiz.id}-${result.id}.html`
}

export function kindLabel(quiz) {
  if (quiz.kind === "worldcup") return "월드컵 · 8강"
  return `퀴즈 · ${quiz.questions.length}문항`
}

export function tagLabel(id) {
  return tags.find((tag) => tag.id === id)?.label ?? id
}

export function formatHot(n) {
  if (n >= 10000) {
    const man = Math.round((n / 10000) * 10) / 10
    return `${man.toFixed(1).replace(/\.0$/, "")}만`
  }
  return new Intl.NumberFormat("ko-KR").format(n)
}

export function assertContent() {
  const ids = new Set()
  if (quizzes.length < 4) throw new Error("need a gallery, not a single test")
  for (const quiz of quizzes) {
    if (!idPattern.test(quiz.id)) throw new Error(`bad quiz id ${quiz.id}`)
    if (ids.has(quiz.id)) throw new Error(`duplicate quiz ${quiz.id}`)
    ids.add(quiz.id)
    for (const key of ["title", "emoji", "blurb", "published"]) {
      if (!quiz[key]) throw new Error(`${quiz.id} missing ${key}`)
    }
    if (!quiz.tags.length) throw new Error(`${quiz.id} needs tags`)
    for (const tag of quiz.tags) {
      if (!tags.some((item) => item.id === tag)) throw new Error(`${quiz.id} unknown tag ${tag}`)
    }
    if (quiz.kind === "quiz") {
      if (quiz.questions.length !== 3) throw new Error(`${quiz.id} must have 3 questions`)
      for (const question of quiz.questions) {
        if (!question.q || !question.a || !question.b) throw new Error(`${quiz.id} incomplete question`)
      }
      const scores = quiz.results.map((result) => result.score).sort((a, b) => a - b)
      if (scores.join(",") !== "0,1,2,3") throw new Error(`${quiz.id} scores must be 0,1,2,3`)
    } else if (quiz.kind === "worldcup") {
      if (quiz.fighters.length !== 8) throw new Error(`${quiz.id} needs 8 fighters`)
    } else {
      throw new Error(`${quiz.id} unknown kind ${quiz.kind}`)
    }
    const seen = new Set()
    for (const result of resultsOf(quiz)) {
      if (!idPattern.test(result.id)) throw new Error(`bad result id ${quiz.id}/${result.id}`)
      if (seen.has(result.id)) throw new Error(`duplicate result ${quiz.id}/${result.id}`)
      seen.add(result.id)
      for (const key of ["title", "meter", "summary", "comment"]) {
        if (!String(result[key] ?? "").trim()) throw new Error(`${quiz.id}/${result.id} missing ${key}`)
      }
    }
  }
}
