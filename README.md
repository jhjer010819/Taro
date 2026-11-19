# 타로

심심하면 뇌 끄는 테스트장. 퀴즈는 3~5문제, 편의점 야식 월드컵, 결과 카드, 그리고 끝나자마자 붙는 다른 테스트 세 장.

주소는 [taro.mymallow.cloud](https://taro.mymallow.cloud). 영어 페이지는 [/en/](https://taro.mymallow.cloud/en/)이다. 한국어 주소는 그대로다.

## 로컬에서 보기

```bash
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:4731` 을 연다. 영어는 `http://127.0.0.1:4731/en/`.

```bash
npm run build
npm run preview
npm run check
```

`check`는 문항, 결과 페이지, 공유 버튼, 관련 테스트 3장, 결과 이미지가 다 있는지 확인한다. 퀴즈 파일이 깨지면 그 파일 이름을 찍고 실패한다.

## 페이지

- `/` 인기·최신 정렬과 태그 필터가 있는 카드 진열장
- `/quiz/quiz-*.html` 카톡으로 들어오는 플레이 페이지. 상단에 홈, 다른 테스트 구경하기
- `/result/result-*.html` 결과 카드, 카카오톡·링크 공유, 다시 하기, 관련 테스트 3장
- `/en/`, `/en/quiz/quiz-*.html`, `/en/result/result-*.html` 같은 구성의 영어 페이지. 번역이 있는 테스트만 영어 진열장에 나온다

헤더의 한국어 / English는 같은 테스트가 있으면 그 페이지로, 없으면 그 언어의 홈으로 간다. 양쪽 다 있는 페이지는 `hreflang`로 서로를 가리킨다.

테스트는 언어마다 JSON 하나다. 한국어는 `src/quizzes/<id>.json`, 영어는 `src/quizzes/en/<id>.json`. `src/content.js`가 언어별로 그 폴더의 JSON을 읽는다. 파일을 넣고 `npm run dev` 또는 `npm run build`를 하면 HTML과 공유 이미지가 다시 만들어진다. 생성된 `index.html`, `quiz/`, `result/`, `en/`은 직접 고치지 않는다.

퀴즈 점수는 B를 고른 개수다. 3문제면 0~3, 5문제면 0~5. 결과마다 `score` 하나, 또는 `min`/`max` 범위를 적고, 0부터 문항 수까지를 빠짐없이 한 번씩 덮는다. 월드컵은 8강 고정 대진이다.

## 테스트 추가하기

새 테스트는 `src/quizzes/<id>.json` 하나만 추가하면 된다. 빌드와 `npm run check`는 그 폴더의 JSON으로 진열 순서를 계산하고, 파일마다 한 번씩만 들어갔는지 확인한다. `id`는 파일 이름과 같다. JSON이 깨지거나 문항·점수가 비면 `npm run build`가 그 파일 이름을 에러에 남기고 멈춘다. 배포도 그 빌드라서 깨진 내용은 올라가지 않는다.

`kind`는 `quiz` 또는 `worldcup`이다.

- `id` — 영문 소문자, 숫자, 하이픈. 플레이 주소는 `/quiz/quiz-<id>.html`, 결과 주소는 `/result/result-<id>-<결과 id>.html`
- `title`, `emoji`, `blurb` — 카드와 공유 문구
- `hot` — 0 이상의 정수. 홈 인기 정렬에 쓰고, 카드에는 참여 수로 보인다. 클수록 앞이다
- `published` — `YYYY-MM-DD`. 홈 최신 정렬에 쓴다. 가장 최근 날짜에 최신 도장, hot 상위 둘에 인기 도장이 붙는다
- `tags` — 하나 이상. 홈 필터이고, 결과 페이지의 다른 테스트 3장은 태그가 많이 겹치는 순, 같으면 hot 순이다

태그는 이 여섯 개만 있다.

| id | 화면 |
| --- | --- |
| `power` | 병맛전투력 |
| `trend` | 트렌드분석 |
| `bored` | 심심풀이 |
| `people` | 인간관계 |
| `food` | 음식 |
| `work` | 직장 |

퀴즈는 질문 3~5개, 결과 3~6개다. `a`는 0점, `b`는 1점이다. `score`는 그 점수 하나고, `min`과 `max`는 양 끝을 포함한 범위다. 둘을 같이 적지 않는다. 문항 수와 결과 수가 다르면 범위로 묶는다. 3문제에 결과가 4개면 `score` 0, 1, 2, 3이면 된다.

월드컵은 전사 8명이다. 이긴 전사의 결과 페이지로 간다.

퀴즈 예. 파일 이름은 `src/quizzes/example-quiz.json`.

```json
{
  "id": "example-quiz",
  "kind": "quiz",
  "title": "출근 가방 속도",
  "emoji": "🎒",
  "blurb": "알람부터 책상까지. B를 고른 개수로 아침 속도가 갈린다.",
  "tags": ["work", "bored"],
  "hot": 1200,
  "published": "2026-11-12",
  "questions": [
    { "q": "알람이 울렸다.", "a": "한 번 더 잔다.", "b": "바로 일어난다." },
    { "q": "현관에서 멈췄다.", "a": "양말을 다시 고른다.", "b": "신발을 신고 나간다." },
    { "q": "엘리베이터가 늦다.", "a": "벽을 보며 기다린다.", "b": "계단으로 올라간다." },
    { "q": "신호등이 빨간불이다.", "a": "음악을 고른다.", "b": "이미 건너편을 본다." },
    { "q": "자리에 앉았다.", "a": "물을 먼저 마신다.", "b": "할 일부터 연다." }
  ],
  "results": [
    {
      "id": "slow",
      "min": 0,
      "max": 1,
      "title": "이불 연장전",
      "meter": "속도 12",
      "summary": "아침의 대부분을 이불한테 양보했다.",
      "comment": "지각 사유는 이미 머릿속에 있다."
    },
    {
      "id": "steady",
      "score": 2,
      "title": "보통 시계",
      "meter": "속도 48",
      "summary": "서두르지도 늦지도 않다. 엘리베이터가 오늘을 결정한다.",
      "comment": "이 속도가 제일 오래간다."
    },
    {
      "id": "brisk",
      "min": 3,
      "max": 4,
      "title": "성큼파",
      "meter": "속도 80",
      "summary": "발이 머리보다 빠르다. 신호등만 봐 준다.",
      "comment": "친구는 너보다 늦게 도착한다."
    },
    {
      "id": "blast",
      "score": 5,
      "title": "발사대",
      "meter": "속도 99",
      "summary": "다섯 장면 모두 먼저 움직였다. 물도 나중이다.",
      "comment": "오늘은 이미 자리에 있다."
    }
  ]
}
```

월드컵 예. 파일 이름은 `src/quizzes/example-cup.json`.

```json
{
  "id": "example-cup",
  "kind": "worldcup",
  "title": "책상 위 음료 이상형 월드컵",
  "emoji": "🥤",
  "blurb": "8강 고정 대진. 더 당기는 잔이 오늘 오후를 정한다.",
  "tags": ["food", "work"],
  "hot": 800,
  "published": "2026-11-12",
  "fighters": [
    { "id": "americano", "emoji": "☕", "name": "아메리카노", "tease": "쓴맛으로 눈을 뜸", "title": "아메리카노 직진", "meter": "오후 연료", "summary": "메뉴판을 안 본다. 쓴맛이 일정이다.", "comment": "시럽 제안은 정중히 거절한다." },
    { "id": "latte", "emoji": "🥛", "name": "카페라떼", "tease": "우유로 하루를 둥글리기", "title": "라떼 온기파", "meter": "오후 연료", "summary": "온도가 맞아야 일이 된다. 거품은 보너스다.", "comment": "디카페인도 라떼면 인정한다." },
    { "id": "tea", "emoji": "🍵", "name": "녹차", "tease": "카페인인데 아닌 척", "title": "티백 한 장주의", "meter": "오후 연료", "summary": "향으로 집중한다. 커피 줄에서는 빠진다.", "comment": "두 장은 과속이라고 생각한다." },
    { "id": "cola", "emoji": "🥤", "name": "콜라", "tease": "단맛이 회의를 밀어줌", "title": "캔으로 버티기", "meter": "오후 연료", "summary": "탄산이 떨어지는 순간이 퇴근 신호다.", "comment": "얼음이 녹기 전에 끝낸다." },
    { "id": "ade", "emoji": "🍋", "name": "레몬에이드", "tease": "단짠이 아니라 단신", "title": "에이드로 환기", "meter": "오후 연료", "summary": "단맛이 필요하지만 커피는 거절이다.", "comment": "오후 세 시에 손이 간다." },
    { "id": "water", "emoji": "💧", "name": "생수", "tease": "선택을 선택하지 않음", "title": "물만 마시는 사람", "meter": "오후 연료", "summary": "갈증과 취향을 분리한다. 텀블러가 본인이다.", "comment": "회식 자리에서도 잔은 물이다." },
    { "id": "choco", "emoji": "🍫", "name": "초코우유", "tease": "점심이 부족했던 증거", "title": "초코로 보정", "meter": "오후 연료", "summary": "단맛이 식사가 된다. 죄책감은 다음 잔으로 미룬다.", "comment": "냉장고를 열 때 이미 결정되어 있다." },
    { "id": "energy", "emoji": "⚡", "name": "에너지드링크", "tease": "한 캔에 야근 예약", "title": "캔으로 시간 벌기", "meter": "오후 연료", "summary": "졸음을 성분표로 이긴다. 효과는 짧고 자신감은 길다.", "comment": "두 캔째에서 손이 떨리면 내일은 물이다." }
  ]
}
```

## 번역 추가하기

번역도 퀴즈마다 JSON 하나다. 스키마는 위의 한국어 예와 같다. 화면 문구(버튼, 공유, 메타)는 `src/i18n.js`에 있고, 퀴즈 본문만 파일로 나뉜다.

영어 테스트를 넣을 때:

1. 한국어 파일이 있으면 그 `id`를 그대로 쓴다. 영어에만 있는 테스트면 새 `id`를 만든다.
2. `src/quizzes/en/<id>.json`을 만든다.
3. 같은 `id`면 `kind`, 결과 `id`, 점수 범위(`score` 또는 `min`/`max`)가 한국어와 같아야 한다. 문항 수와 결과 수도 그렇게 맞춰진다. 문구만 그 언어로 적는다.
4. `npm run build` 다음 `npm run check`.

주소는 `/en/quiz/quiz-<id>.html`, 결과는 `/en/result/result-<id>-<결과 id>.html`이다. 사이트맵에도 들어간다. 공유 이미지는 영어 문구로 다시 그려진다.

새 언어는 같은 방식으로 하나 더 붙인다.

1. `src/content.js`의 `locales`에 항목을 추가한다. `id`는 폴더 이름, `prefix`는 `/ja` 같은 주소 앞부분, `htmlLang`과 `ogLocale`은 그 언어 코드, `label`은 헤더에 보일 이름이다. 첫 항목은 한국어이고 `prefix`가 비어 있다. 이 항목의 주소를 바꾸면 기존 링크가 깨진다.
2. `src/i18n.js`의 `copy`에 같은 `id`로 화면 문구를 넣는다.
3. `src/quizzes/<id>/<퀴즈 id>.json`을 넣는다.

## 공유

결과 페이지의 주소와 `og:image`가 고정이라, 카톡에 링크를 붙여 넣으면 결과 카드가 미리보기로 붙는다. 카카오 JavaScript 키 없이도 모바일은 공유 시트를, 데스크톱은 링크 복사를 쓴다.

카카오 피드 공유(앱 키)를 켜려면 카카오 개발자 콘솔에 도메인을 등록한 뒤, 결과 페이지 `<html>`에 `data-kakao-key`를 넣고 SDK 스크립트를 추가한다. 키는 브라우저에 노출되는 JavaScript 키만 쓴다.

```html
<html lang="ko" data-kakao-key="카카오 JavaScript 키">
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js" crossorigin="anonymous"></script>
```

미리보기가 옛 이미지로 남으면 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 해당 결과 주소를 다시 긁으면 된다. 이미지 파일 이름에는 내용 해시가 들어 있다.

## taro.mymallow.cloud

정적 사이트다. `main`에 푸시하면 `.github/workflows/deploy-pages.yml`이 GitHub Actions에서 `npm ci`, `npm run build`, `npm run check`를 실행하고 `dist/`를 GitHub Pages에 배포한다. `gh-pages` 브랜치는 쓰지 않는다. 산출물에는 `CNAME`(`taro.mymallow.cloud`)과 `.nojekyll`이 들어간다.

Pages 설정은 저장소 Settings → Pages → Source: GitHub Actions다.

DNS는 Cloudflare에 있다. apex `mymallow.cloud`는 GitHub Pages를 가리키니 그대로 둔다. `taro`는 CNAME으로 `jhjer010819.github.io`를 가리킨다.

## 글꼴

화면 글꼴은 Gmarket Sans(Gmarket, 상업적 이용 가능)다. 결과 카드 이미지도 같은 글꼴로 그린다.
