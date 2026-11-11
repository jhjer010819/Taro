# 타로

심심하면 뇌 끄는 테스트장. 퀴즈 세 문제, 편의점 야식 월드컵, 결과 카드, 그리고 끝나자마자 붙는 다른 테스트 세 장.

주소는 [taro.mymallow.cloud](https://taro.mymallow.cloud).

## 로컬에서 보기

```bash
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:4731` 을 연다.

```bash
npm run build
npm run preview
npm run check
```

`check`는 문항, 결과 페이지, 공유 버튼, 관련 테스트 3장, 결과 이미지가 다 있는지 확인한다.

## 페이지

- `/` 인기·최신 정렬과 태그 필터가 있는 카드 진열장
- `/quiz/quiz-*.html` 카톡으로 들어오는 플레이 페이지. 상단에 홈, 다른 테스트 구경하기
- `/result/result-*.html` 결과 카드, 카카오톡·링크 공유, 다시 하기, 관련 테스트 3장

퀴즈 데이터는 `src/content.js` 한 파일이다. 문항을 고치고 `npm run dev` 또는 `npm run build`를 하면 HTML과 공유 이미지가 다시 만들어진다. 생성된 `index.html`, `quiz/`, `result/`는 직접 고치지 않는다.

결과는 B를 고른 개수(0~3)로 갈린다. 월드컵은 8강 고정 대진이다.

## 공유

결과 페이지의 주소와 `og:image`가 고정이라, 카톡에 링크를 붙여 넣으면 결과 카드가 미리보기로 붙는다. 카카오 JavaScript 키 없이도 모바일은 공유 시트를, 데스크톱은 링크 복사를 쓴다.

카카오 피드 공유(앱 키)를 켜려면 카카오 개발자 콘솔에 도메인을 등록한 뒤, 결과 페이지 `<html>`에 `data-kakao-key`를 넣고 SDK 스크립트를 추가한다. 키는 브라우저에 노출되는 JavaScript 키만 쓴다.

```html
<html lang="ko" data-kakao-key="카카오 JavaScript 키">
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js" crossorigin="anonymous"></script>
```

미리보기가 옛 이미지로 남으면 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 해당 결과 주소를 다시 긁으면 된다. 이미지 파일 이름에는 내용 해시가 들어 있다.

## taro.mymallow.cloud

정적 사이트다. `render.yaml`이 Render 정적 사이트를 만들고 `taro.mymallow.cloud`를 붙이도록 되어 있다. 저장소가 GitHub, GitLab, Bitbucket에 올라간 뒤 [Render Blueprint](https://dashboard.render.com/blueprint/new)로 이 저장소를 연결하면 된다.

DNS는 Cloudflare에 있다. apex `mymallow.cloud`는 GitHub Pages를 가리키니 건드리지 않는다. `taro`만 추가한다.

1. Render 서비스가 생기면 `onrender.com` 주소를 복사한다.
2. Cloudflare → `mymallow.cloud` → DNS → 레코드 추가.
3. 타입 CNAME, 이름 `taro`, 대상은 그 `onrender.com` 주소, 프록시는 DNS only(회색 구름).
4. `taro`에 AAAA 레코드가 있으면 지운다.
5. Render 대시보드 Custom Domains에서 Verify. 인증서가 발급된 뒤에만 주황 구름으로 바꿔도 된다.

SSL/TLS 모드는 Full.

## 글꼴

화면 글꼴은 Gmarket Sans(Gmarket, 상업적 이용 가능)다. 결과 카드 이미지도 같은 글꼴로 그린다.
