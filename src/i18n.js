// Screen copy, one object per locale id in src/content.js `locales`.
// Quiz text itself lives in src/quizzes (Korean) and src/quizzes/<dir> (other languages).

export const copy = {
  ko: {
    siteName: "타로",
    tagline: "심심하면 뇌 끄는 테스트장",
    skip: "본문으로",
    home: "홈",
    browse: "다른 테스트 구경하기",
    close: "닫기",
    here: " · 지금 여기",
    langLabel: "언어",
    played: "참여",
    start: "시작하기",
    stampHot: "인기",
    stampNew: "최신",
    sortLabel: "정렬",
    sortHot: "인기",
    sortNew: "최신",
    tagAll: "전체",
    empty: "이 태그엔 아직 없다. 전체 눌러 봐.",
    preparing: "문제 꺼내는 중이다.",
    restart: "처음부터 다시",
    shareKakao: "카카오톡으로 공유",
    shareLink: "링크 공유하기",
    retry: "다시 하기",
    more: "다른 테스트도 해보기",
    finalResult: "최종 결과",
    commentLabel: "한줄평",
    footerNote: "재미로 보는 거다. 결과는 내일 아침이면 무효.",
    footerNav: "안내",
    about: "소개",
    privacy: "개인정보 처리방침",
    terms: "이용약관",
    fontCredit: "글꼴 Gmarket Sans · Gmarket",
    kindCup: "하나만 남을 때까지",
    kindQuiz(n) {
      return `딱 ${n}개만 고르면 끝`
    },
    shareText(quizTitle, resultTitle) {
      return `[타로] ${quizTitle}\n내 결과는 「${resultTitle}」.\n너도 해봐.`
    },
    kickerQuiz: "퀴즈",
    kickerCup: "월드컵",
    kickerResult: "결과",
    kickerHome: "입장",
    cornerHome: "B급 인증",
    homeTitle: "타로 | 심심하면 뇌 끄는 테스트장",
    homeDescription:
      "병맛 전투력, 카톡 답장, 점심 메뉴, 편의점 야식. 심심하면 하나 골라서 결과 카드 던져 봐.",
    ticker:
      "※ 과학 아님 ※ 심심풀이용 ※ 결과는 내일 아침 무효 ※ 단톡에 던져 볼 것 ※ 편의점 야식은 진지함 ※ 퇴사각은 재미로만 ※ ",
    stampScience: "과학 아님",
    stampGrade: "B급 인증",
    heroDesc: "심심하면 아무거나 하나. 금방 끝난다.",
    galleryTitle: "테스트 모아둠",
    galleryDesc: "많이 한 것부터 올려 뒀다. 태그로 걸러도 되고, 새로 나온 것부터 봐도 된다.",
    unverified: "",
    cupPrompt: "더 당기는 쪽을 찍어.",
    cupFinal: "결승",
    cupRoundTemplate: "{n}강",
    missingResult: "결과를 못 찾았다. 홈에서 다시 해 봐.",
    tags: {
      power: "병맛전투력",
      trend: "트렌드",
      bored: "심심풀이",
      people: "인간관계",
      food: "음식",
      work: "직장",
    },
    client: {
      kakaoTry: "나도 해보기",
      toastKakaoOk: "카카오톡에 붙여넣을 링크 복사함.",
      toastKakaoFail: "복사 못 함. 주소창 링크를 길게 눌러 복사해.",
      toastLinkOk: "링크 복사함. 대화방에 붙여넣어.",
      toastLinkFail: "복사 못 함. 주소창에서 직접 복사해.",
    },
    miss: {
      title: "증발한 주소 | 타로",
      description: "이 주소는 없다. 테스트는 홈에 있다.",
      stamp: "실종",
      heading: "이 주소는 장난치다 증발했다.",
      body: "테스트는 홈에 있다. 하나 고르면 금방 끝난다.",
      home: "홈으로",
    },
    infoPages: [
      {
        slug: "about",
        title: "소개 | 타로",
        description: "타로는 마이멜로(MyMallow)가 운영하는 심심풀이 사이트입니다.",
        main: `<section class="miss doc">
      <p class="stamp stamp--result">안내</p>
      <h1>소개</h1>
      <p>타로는 마이멜로(MyMallow)가 운영하는 심심풀이 사이트입니다. 짧은 퀴즈랑 월드컵으로 엉뚱한 결과가 나오고, 그 결과를 카카오톡으로 보낼 수 있습니다.</p>
      <p>결과는 재미용입니다. 성격, 진로, 건강, 사람 관계를 판단하거나 맞히지 않습니다.</p>
      <h2>운영</h2>
      <p>마이멜로 (MyMallow)</p>
      <p>문의 연락처는 이 사이트에 따로 공개되어 있지 않습니다.</p>
    </section>`,
      },
      {
        slug: "privacy",
        title: "개인정보 처리방침 | 타로",
        description: "타로는 회원가입 없이 이용하는 오락 사이트입니다. 답변은 브라우저 안에서만 계산됩니다.",
        main: `<section class="miss doc">
      <p class="stamp stamp--result">안내</p>
      <h1>개인정보 처리방침</h1>
      <p>타로는 마이멜로(MyMallow)가 운영하는 오락용 웹사이트입니다. 회원가입 없이 이용합니다. 아래는 사이트가 실제로 하는 일만 짧게 적었습니다. 2026년 11월 12일에 정리했습니다.</p>
      <h2>수집과 저장</h2>
      <p>퀴즈 답과 월드컵 선택은 결과 화면을 만들기 위해, 이용 중인 브라우저 안에서만 계산됩니다. 답변을 서버에 저장하지 않고, 계정도 만들지 않습니다.</p>
      <h2>카카오톡 공유</h2>
      <p>결과 화면에서 공유를 누르면 결과 제목, 짧은 문구, 이미지 주소, 페이지 주소가 기기의 공유 기능으로 넘어가거나 링크가 복사됩니다. 카카오톡 공유가 연결되어 있으면 같은 내용이 카카오톡 공유로 전달될 수 있습니다. 타로가 그 내용을 따로 보관하지는 않습니다.</p>
      <h2>분석과 광고</h2>
      <p>방문 통계를 위한 분석 도구나 광고는 넣어 두지 않았습니다.</p>
      <h2>운영</h2>
      <p>마이멜로 (MyMallow). 문의 연락처는 이 사이트에 따로 공개되어 있지 않습니다.</p>
    </section>`,
      },
      {
        slug: "terms",
        title: "이용약관 | 타로",
        description: "타로는 마이멜로(MyMallow)의 무료 오락 사이트입니다. 결과는 재미를 위한 것입니다.",
        main: `<section class="miss doc">
      <p class="stamp stamp--result">안내</p>
      <h1>이용약관</h1>
      <p>타로는 마이멜로(MyMallow)가 운영하는 무료 오락 사이트입니다. 퀴즈와 월드컵 결과는 재미를 위한 것이며, 사실의 판단이나 전문적인 조언이 아닙니다. 2026년 11월 12일에 정리했습니다.</p>
      <h2>이용</h2>
      <p>따로 가입하지 않고 볼 수 있습니다. 결과 링크를 친구에게 공유하는 것도 이용에 포함됩니다.</p>
      <h2>결과</h2>
      <p>결과는 언제든지 바뀌거나 내려갈 수 있습니다. 이 페이지는 법적 효력을 단정하는 계약서가 아니라, 사이트가 어떤 곳인지 알리는 안내입니다.</p>
      <h2>운영</h2>
      <p>마이멜로 (MyMallow). 문의 연락처는 이 사이트에 따로 공개되어 있지 않습니다.</p>
    </section>`,
      },
    ],
  },
  en: {
    siteName: "Taro",
    tagline: "Weird little tests for when you're bored",
    skip: "Skip to content",
    home: "Home",
    browse: "Browse tests",
    close: "Close",
    here: " · you are here",
    langLabel: "Language",
    played: "plays",
    start: "Start",
    stampHot: "Hot",
    stampNew: "New",
    sortLabel: "Sort",
    sortHot: "Hot",
    sortNew: "New",
    tagAll: "All",
    empty: "Nothing with this tag yet. Hit All and keep scrolling.",
    preparing: "Grabbing the questions.",
    restart: "Start over",
    shareKakao: "Share to KakaoTalk",
    shareLink: "Copy link",
    retry: "Take it again",
    more: "More unhinged tests",
    finalResult: "Your result",
    commentLabel: "The take",
    footerNote: "Just for fun. Results expire by morning.",
    footerNav: "Info",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    fontCredit: "Typeface: Gmarket Sans · Gmarket",
    kindCup: "Until one's left",
    kindQuiz(n) {
      const word = ["", "", "", "Three", "Four", "Five"][n]
      return `${word || n} and done`
    },
    shareText(quizTitle, resultTitle) {
      return `[Taro] ${quizTitle}\nI got "${resultTitle}".\nYour turn.`
    },
    kickerQuiz: "QUIZ",
    kickerCup: "CUP",
    kickerResult: "RESULT",
    kickerHome: "ENTER",
    cornerHome: "NOT SCIENCE",
    homeTitle: "Taro | weird little tests for when you're bored",
    homeDescription:
      "Chaos, texting speed, lunch paralysis, late-night snacks. Grab one and send the card.",
    ticker:
      "※ NOT SCIENCE ※ FOR FUN ※ EXPIRES BY MORNING ※ DROP IT IN THE GROUP CHAT ※ SNACKS ARE SERIOUS ※ QUITTING IS A BIT ※ ",
    stampScience: "Not science",
    stampGrade: "Unverified",
    heroDesc: "Bored? Pick one. It's over before the group chat moves on.",
    galleryTitle: "The tests",
    galleryDesc: "Most played first. Filter by a tag, or start with whatever just dropped.",
    unverified: "Not science, 100% unverified",
    cupPrompt: "Tap the one you want.",
    cupFinal: "Final",
    cupRoundTemplate: "Round of {n}",
    missingResult: "Couldn't find a result. Head home and try again.",
    tags: {
      power: "Chaos",
      trend: "Trends",
      bored: "Bored",
      people: "People",
      food: "Food",
      work: "Work",
    },
    client: {
      kakaoTry: "Try it too",
      toastKakaoOk: "Copied a link you can paste into KakaoTalk.",
      toastKakaoFail: "Couldn't copy that. Long-press the address bar and copy it there.",
      toastLinkOk: "Link copied. Paste it in the chat.",
      toastLinkFail: "Couldn't copy that. Grab the link from the address bar.",
    },
    miss: {
      title: "This page isn't here | Taro",
      description: "That address isn't a thing. The tests are on the home page.",
      stamp: "Missing",
      heading: "This page isn't here.",
      body: "The tests are on the home page. Pick one and you're done.",
      home: "Back home",
    },
    infoPages: [
      {
        slug: "about",
        title: "About | Taro",
        description: "Taro is a boredom site run by MyMallow. Short quizzes, silly results, nothing scientific.",
        main: `<section class="miss doc">
      <p class="stamp stamp--result">Note</p>
      <h1>About</h1>
      <p>Taro is a just-for-fun site run by MyMallow. Short quizzes and goofy brackets hand you a ridiculous result you can drop in the group chat.</p>
      <p>The results are entertainment. They do not judge your personality, your job, your health, or your relationships.</p>
      <h2>Who runs this</h2>
      <p>MyMallow</p>
      <p>There is no public contact address on this site.</p>
    </section>`,
      },
      {
        slug: "privacy",
        title: "Privacy | Taro",
        description: "Taro works without an account. Your answers stay in the browser.",
        main: `<section class="miss doc">
      <p class="stamp stamp--result">Note</p>
      <h1>Privacy</h1>
      <p>Taro is an entertainment site run by MyMallow. No account required. This page only describes what the site actually does. Written November 12, 2026.</p>
      <h2>What gets stored</h2>
      <p>Quiz answers and bracket picks are calculated in your browser so the result page can load. Answers are not saved on a server, and no account is created.</p>
      <h2>Sharing</h2>
      <p>When you share a result, the title, a short line, the image address, and the page address go to your device's share sheet, or the link is copied. If KakaoTalk sharing is connected, that same bundle can be handed to KakaoTalk. Taro does not keep a copy.</p>
      <h2>Analytics and ads</h2>
      <p>Analytics tools and ads for visit stats are not installed.</p>
      <h2>Who runs this</h2>
      <p>MyMallow. There is no public contact address on this site.</p>
    </section>`,
      },
      {
        slug: "terms",
        title: "Terms | Taro",
        description: "Taro is MyMallow's free entertainment site. Results are for fun.",
        main: `<section class="miss doc">
      <p class="stamp stamp--result">Note</p>
      <h1>Terms</h1>
      <p>Taro is a free entertainment site run by MyMallow. Quiz and bracket results are for fun. They are not facts and not professional advice. Written November 12, 2026.</p>
      <h2>Using the site</h2>
      <p>You can read it without signing up. Sending a result link to a friend counts as using the site.</p>
      <h2>Results</h2>
      <p>Results can change or come down at any time. This page is a description of the site, not a contract that claims legal force.</p>
      <h2>Who runs this</h2>
      <p>MyMallow. There is no public contact address on this site.</p>
    </section>`,
      },
    ],
  },
}

export function copyFor(localeId) {
  const strings = copy[localeId]
  if (!strings) throw new Error(`missing UI copy for locale ${localeId} (src/i18n.js)`)
  return strings
}
