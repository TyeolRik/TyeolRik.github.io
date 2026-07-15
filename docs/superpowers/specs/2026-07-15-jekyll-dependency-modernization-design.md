# Jekyll 및 GitHub Pages 현대화 설계

- 작성일: 2026-07-15
- 대상 저장소: `TyeolRik/TyeolRik.github.io`
- 공개 URL: `https://tyeolrik.github.io`
- 상태: 사용자 승인 완료

## 1. 배경

이 저장소는 93개 게시물, 152개 태그 페이지, 24개 카테고리 페이지를 제공하는 Jekyll 기반 GitHub Pages 사용자 사이트다. 현재 GitHub Pages는 `master` 브랜치 루트를 직접 빌드하는 `legacy` 방식이며 공개 사이트는 정상 게시 중이다.

저장소의 잠금 파일은 Ruby 3.4.8, Bundler 2.6.9, Jekyll 4.4.1을 기록하지만 로컬 기본 환경은 macOS 시스템 Ruby 2.6.10이고 필요한 Bundler와 Jekyll이 없다. Travis CI는 Ruby 2.2.2를 사용하도록 남아 있으며 로컬 스크립트는 전역 Gem과 전역 `jekyll` 실행 파일에 의존한다. 프런트엔드에는 Bootstrap 3.3.5, jQuery 1.11.3, Hammer.js 2.0.4, 구형 Typed.js와 RRSSB 등 오래된 자산이 포함되어 있다.

`ComputerGraphics/`는 약 9.4MB의 대학 과제 코드와 모델·텍스처를 담고 있으며 저장소의 다른 콘텐츠에서 참조되지 않는다. 이 영역은 현대화하지 않고 전체 삭제한다.

## 2. 목표

1. 모든 직접 의존성을 2026-07-15 기준 최신 안정판으로 갱신하거나 불필요하면 제거한다.
2. 간접 의존성은 상위 패키지가 허용하는 최신 호환판을 사용한다.
3. 로컬과 GitHub Actions가 동일한 Ruby, Bundler, Gem 잠금 파일과 Jekyll 명령을 사용한다.
4. 기존 게시물·태그·카테고리 URL, 콘텐츠, 주요 기능과 시각적 인상을 보존한다.
5. GitHub Pages 배포를 `legacy` 브랜치 빌드에서 검증된 GitHub Actions artifact 배포로 전환한다.
6. `ComputerGraphics/`와 폐기된 서비스·브라우저 호환 코드를 제거한다.
7. GA4 측정 ID `G-WYMVRPT9ZB`를 실제 공개 호스트에서 즉시 로드한다.
8. 로컬 빌드와 브라우저 검증을 통과한 뒤에만 원격 CI와 Pages 전환을 수행한다.

## 3. 비목표

- 사이트 전면 재설계
- 게시물 내용의 교정 또는 URL 변경
- `wedding/` 콘텐츠나 계좌 정보 변경
- 외부 링크 오류로 Pages 배포 차단
- 자동 GitHub Issue 생성
- Node 기반 프런트엔드 번들러 도입
- 삭제한 `ComputerGraphics/` URL의 리다이렉트 또는 대체 페이지 제공

## 4. 핵심 결정

### 4.1 단계적 최신화

변경은 런타임, Jekyll, 프런트엔드, CI, Pages 전환 순서로 진행한다. 각 단계는 다음 단계로 넘어가기 전에 로컬 빌드와 관련 검증을 통과해야 한다. 여러 영역을 한 번에 갱신하지 않아 실패 원인과 시각적 회귀를 분리한다.

### 4.2 최신 버전 정책

다음 버전을 구현 목표로 고정한다.

| 구성 요소 | 목표 버전 | 처리 |
| --- | ---: | --- |
| Ruby | 4.0.6 | `.ruby-version`, `Gemfile`, Actions에서 일치 |
| Bundler | 4.0.16 | 잠금 파일 생성 버전과 CI 일치 |
| Jekyll | 4.4.1 | 직접 의존성 |
| html-proofer | 5.2.1 | 테스트 그룹 직접 의존성 |
| jekyll-paginate-v2 | 3.0.0 | `jekyll-paginate` 대체 |
| Rouge | 4.7.0 | Jekyll의 `< 5.0` 제약에 따른 간접 최신 호환판 |
| Bootstrap | 5.3.8 | 정확한 CDN 버전과 SRI 고정 |
| MathJax | 4.1.3 | v4 설정 API로 마이그레이션 |
| Typed.js | 3.0.0 | jQuery 플러그인 API 제거 |
| Font Awesome Free | 7.3.0 | 아이콘 클래스 갱신 |

Ruby 4.0.6에서 빌드 실패 시 낮은 버전으로 자동 하향하지 않는다. 먼저 직접·간접 의존성, 제거된 표준 라이브러리, 네이티브 확장 문제를 진단하고 최신 호환 패키지로 해결한다. 상위 프로젝트가 Ruby 4를 지원하지 않는 명확하고 재현 가능한 문제가 남으면 구현을 중단하고 근거를 보고한 뒤, Ruby 목표 버전을 바꾸는 설계 변경에 대해 사용자 승인을 다시 받는다.

### 4.3 의존성 제거

다음 Gem은 사용되지 않거나 중복이므로 직접 의존성에서 제거한다.

- `minima`: 사용자 정의 레이아웃을 사용하며 테마가 설정되지 않음
- `jemoji`: 게시물에 emoji shortcode가 없음
- `wdm`: Windows 전용 감시 도구이며 대상 환경에서 불필요
- `jekyll-feed`: 저장소의 수동 `feed.xml`과 중복
- `rouge`: Jekyll의 간접 의존성
- `webrick`: Jekyll의 간접 의존성
- `jekyll-paginate`: 유지보수된 확장판으로 교체

다음 브라우저 의존성 또는 레거시 기능을 제거한다.

- jQuery와 jQuery Easing
- Hammer.js와 비활성화된 제스처 내비게이션
- Highlight.js와 별도 클라이언트 코드 강조
- RRSSB JavaScript와 CSS
- Google+ 공유
- Universal Analytics `UA-89622772-1`
- HTML5 Shiv, Respond.js와 IE8 조건부 로딩
- 프로토콜 상대 URL

## 5. 아키텍처

### 5.1 콘텐츠 영역

Jekyll은 기존 `_posts`, `_layouts`, `_includes`, 태그, 카테고리, 이미지와 정적 파일을 입력으로 사용한다. 게시물 permalink와 `paginate_path`의 공개 형태는 유지한다. `wedding/`은 Jekyll 출력에 포함되는 독립 정적 애플리케이션으로 남긴다. `ComputerGraphics/`는 디렉터리 전체를 삭제하고 저장소 내 참조가 0개인지 검사한다.

### 5.2 빌드 영역

Bundler만 Ruby 의존성을 관리한다. 로컬과 Actions는 잠금 파일을 기준으로 설치하고 다음 명령으로 프로덕션 출력을 생성한다.

```sh
JEKYLL_ENV=production bundle exec jekyll build --trace
```

`jekyll-paginate-v2`에 맞춰 플러그인 선언, 블로그 front matter, 페이지네이션 설정을 마이그레이션하되 `/blog/`, `/blog/page2/` 형식은 유지한다. 코드 강조는 Jekyll/Rouge 하나로 통일하고 Rouge용 CSS를 사이트 스타일에 포함한다.

### 5.3 브라우저 영역

Bootstrap 5에 맞게 내비게이션, 그리드, 토글 속성 및 관련 사용자 정의 CSS를 마이그레이션한다. 기존 화면의 색상, 배경 이미지, 섹션 구성, 게시물 폭과 모바일 사용성을 유지한다.

Typed.js는 최신 생성자 API로 초기화한다. MathJax 설정은 스크립트보다 먼저 `window.MathJax`에 선언하고 기존 `\(...\)` 및 `\[...\]` 수식이 렌더링되도록 한다. Font Awesome 아이콘 클래스는 v7 형식으로 갱신한다.

부드러운 스크롤, 모바일 메뉴 닫기, 공유 팝업은 작은 네이티브 JavaScript로 구현한다. 공유 링크와 반응형 배치는 사용자 정의 HTML/CSS로 유지하며 폐기된 Google+ 항목만 제거한다.

CDN 자산은 `https`와 정확한 버전을 사용한다. 가능한 자산에는 SRI와 `crossorigin`을 적용한다. Node 패키지 설치나 번들 단계는 추가하지 않는다.

### 5.4 분석

공통 Jekyll head와 `wedding/index.html`에 GA4 Google tag를 추가한다. 측정 ID는 공개 설정 값 `G-WYMVRPT9ZB`를 사용하며 비밀 저장소 값으로 취급하지 않는다. 방문자 동의 배너 없이 실제 공개 사이트에서 즉시 `page_view`를 전송한다.

로컬 개발 트래픽이 통계에 섞이지 않도록 Analytics 로더는 `location.hostname === "tyeolrik.github.io"`일 때만 활성화한다. 로컬 프로덕션 미리보기에서는 태그 마크업을 확인할 수 있지만 이벤트는 전송하지 않는다.

### 5.5 배포 영역

배포 구조는 다음과 같다.

```text
master source
  -> GitHub Actions production build
  -> internal integrity checks
  -> Pages artifact
  -> GitHub Pages deployment
  -> https://tyeolrik.github.io
```

PR은 같은 빌드와 검사를 실행하지만 배포하지 않는다. 배포 job만 `pages: write`와 `id-token: write`를 받고 빌드 job은 `contents: read`만 사용한다. Pages 동시성 그룹을 사용해 같은 브랜치의 오래된 실행을 취소한다.

## 6. 로컬 개발 도구

기존 명령 이름을 최대한 유지하되 전역 Gem 의존성을 없앤다.

- `scripts/install`: 요구 Ruby 버전을 확인하고 `bundle install` 실행
- `scripts/serve`: `bundle exec jekyll serve --livereload`
- `scripts/serve-production`: 프로덕션 환경의 `bundle exec jekyll serve`
- `scripts/serve-lan`: `--host 0.0.0.0` 사용, `sudo iptables` 제거
- 루트 `newpost`: 저장소 상대 경로와 검증된 인자를 사용하는 단일 글 생성기
- 루트 `generate`: 태그·카테고리 파일을 결정적으로 생성하는 단일 도구

중복된 `scripts/newpost*`, `scripts/generate-*`, `newpost_deprecated`, `scripts/serve-lan-production`을 제거한다. 원본 테마 파일을 파괴적으로 덮어쓰는 `scripts/integrate-personal`도 제거한다. README에는 지원 Ruby 버전, Bundler 설치, 로컬 미리보기, 프로덕션 빌드, Actions 배포와 외부 링크 감사 방법을 기록한다.

## 7. 로컬 우선 전환 흐름

### 단계 A: 기준선

현재 공개 사이트의 핵심 URL과 데스크톱·모바일 화면을 기록한다. 최소 기준선은 홈, 블로그, 페이지네이션, 대표 게시물, 대표 태그·카테고리, feed, sitemap, 404, wedding이다.

### 단계 B: 로컬 구현 및 검증

1. Ruby 4.0.6과 Bundler 4.0.16을 준비한다.
2. 잠금 파일 기준으로 Gem을 설치한다.
3. `bundle exec jekyll build --trace`를 실행한다.
4. `bundle exec jekyll serve`로 개발 미리보기를 확인한다.
5. `JEKYLL_ENV=production bundle exec jekyll serve`로 프로덕션 조건부 렌더링을 확인한다.
6. 내부 링크·HTML 검사와 브라우저 회귀 검증을 통과한다.

단계 B가 완료되기 전에는 GitHub Actions 또는 Pages 설정을 변경하지 않는다.

### 단계 C: 원격 CI 검증

먼저 배포 없는 CI workflow와 구현 변경을 원격 브랜치/PR에서 실행한다. 로컬과 같은 Ruby·Bundler·빌드·검사 결과가 성공해야 한다. 기존 `legacy` Pages는 이 기간 동안 현재 사이트를 계속 제공한다.

### 단계 D: Pages 전환

CI가 성공한 뒤 별도 커밋으로 수동 실행 전용 Pages 배포 workflow를 추가한다. 이 커밋을 `master`에 반영해도 자동 배포는 시작되지 않는다. 그다음 Pages 소스를 GitHub Actions로 전환하고 workflow를 수동 실행한다. 첫 배포와 실제 URL 검증이 성공한 뒤 후속 커밋에서 `master` push 자동 배포 트리거를 추가한다.

## 8. GitHub Actions

### 8.1 CI workflow

PR과 대상 브랜치 push에서 다음을 수행한다.

1. 체크아웃
2. Ruby와 Bundler 준비
3. 잠금 파일 기반 Gem 캐시 및 설치
4. Ruby 스크립트 문법 검사
5. Jekyll 프로덕션 빌드
6. html-proofer 내부 검사
7. 필수 URL과 제거 대상 잔존 검사

### 8.2 Pages workflow

첫 전환에서는 수동 실행만 지원한다. CI와 같은 빌드·검사를 통과한 `_site`만 Pages artifact로 업로드하고 공식 Pages deploy action으로 배포한다. 첫 수동 배포와 공개 사이트 검증이 성공한 뒤 `master` push 트리거를 추가한다.

### 8.3 외부 링크 workflow

주 1회 및 수동 실행으로 프로덕션 사이트를 빌드한 뒤 외부 링크를 검사한다. 외부 서버의 403, 404, 429, timeout은 Actions 요약과 보고서 artifact에 남긴다. 이 workflow의 실패는 Pages 배포를 차단하지 않고 자동 Issue도 만들지 않는다.

### 8.4 Travis 제거

Ruby 2.2.2와 전역 Gem을 사용하는 `.travis.yml`은 GitHub Actions가 같은 검증을 대체한 뒤 삭제한다.

## 9. 실패 처리와 롤백

- Gem 설치, Jekyll 빌드 또는 내부 무결성 검사 실패 시 Pages artifact를 만들거나 배포하지 않는다.
- Ruby 4 호환성 실패는 재현 로그와 원인을 확보한 뒤 해결한다. 최신 의존성으로 해결할 수 없으면 구현을 중단하고 Ruby 버전 변경에 대한 사용자 승인을 요청한다.
- 외부 링크 실패는 보고만 하고 배포를 계속 허용한다.
- CDN SRI 불일치 또는 자산 로딩 실패는 브라우저 검증 실패로 취급한다.
- 새 CI가 성공하기 전에는 `legacy` Pages 설정을 유지한다.
- 첫 Actions 배포가 실패하면 마지막 성공 배포를 유지하고 Pages 설정과 관련 커밋을 이전 상태로 되돌린다.
- 실제 사이트의 핵심 URL 또는 화면에 회귀가 있으면 새 변경을 되돌리고 원인을 수정한 뒤 다시 전체 검증한다.

## 10. 검증 전략

### 10.1 자동 검증

- Ruby, Bundler, Gemfile과 잠금 파일의 버전 일치
- Ruby 스크립트 문법
- 프로덕션 Jekyll 빌드
- 내부 링크, 앵커, 이미지, CSS, JavaScript와 HTML 무결성
- 홈, 블로그, 페이지네이션, 대표 게시물·태그·카테고리, feed, sitemap, 404, wedding 출력 존재
- `ComputerGraphics` 참조 0개
- Universal Analytics, Google+, IE8 shim, 프로토콜 상대 URL 잔존 0개
- `_site`, 캐시, 로컬 설치 산출물이 Git에 포함되지 않음

### 10.2 브라우저 회귀 검증

데스크톱과 모바일 크기에서 다음을 확인한다.

- 내비게이션 열기·닫기와 부드러운 스크롤
- Typed.js 애니메이션
- 블로그 목록과 이전·다음 페이지
- 게시물 Markdown과 Rouge 코드 강조
- MathJax 인라인·블록 수식
- 공유 링크와 팝업
- 프로덕션 전용 Disqus 로딩
- wedding 갤러리, 복사 버튼과 카운트다운
- 콘솔 오류 및 실패한 자산 요청 없음
- 기준선과 비교한 비의도적 레이아웃 변화 없음

### 10.3 배포 후 검증

- Pages API: `build_type: workflow`, `status: built`
- `https://tyeolrik.github.io` 핵심 URL의 HTTP 200
- 정적 자산 정상 로딩
- `ComputerGraphics/project3.html`의 404
- GA4 Realtime 또는 Tag Assistant의 `page_view`
- 외부 링크 workflow의 수동 보고서 생성

## 11. 완료 조건

다음 조건을 모두 충족해야 완료로 판단한다.

1. 로컬 개발 및 프로덕션 Jekyll 빌드가 성공한다.
2. 자동 내부 검증에서 깨진 링크와 누락된 자산이 없다.
3. 주요 브라우저 기능과 모바일 화면이 정상이다.
4. 기존 게시물·태그·카테고리 URL이 유지된다.
5. 직접 의존성은 최신 안정판, 간접 의존성은 최신 호환판이다.
6. 합의한 레거시 코드·서비스·자산이 제거되었다.
7. GitHub Actions CI와 Pages 배포가 성공한다.
8. 공개 사이트와 GA4가 정상 동작한다.
9. README의 설치·실행·배포 설명이 실제 동작과 일치한다.
