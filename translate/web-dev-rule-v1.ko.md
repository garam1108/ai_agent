# Web Dev Rule v1

웹 페이지 코드를 작성할 때마다 따라야 하는 규칙 (`developer` 에이전트가 사용).

## 1. 이름 규칙

- `task_name`은 작업/주제 이름이며 소문자 영문에 하이픈 또는 밑줄로 구분한다(예: `camping-guide`). `references/web/<task_name>/`, `output/web/<task_name>/`에 쓰는 주제 슬러그와 같다.
- GitHub 레포지터리 이름은 정확히 `task_name`이다.

## 2. 코드 구조 (html / css / js)

- 기본 구조는 순수 HTML, CSS, JavaScript이다.

```
output/web/<task_name>/
  index.html
  css/style.css
  js/main.js
  img/            (페이지에 쓰는 이미지)
  lib/            (내려받은 라이브러리, 4번 참조)
```

- 추가 페이지는 `index.html` 옆에 `<page>.html`로 둔다. CSS/JS는 필요할 때만 `css/`, `js/` 안에서 파일을 나눈다.
- CSS는 `<head>`에서, JS는 `</body>` 앞(또는 `defer`)에서 연결한다. 아주 작은 것을 제외하면 인라인 `<style>`/`<script>`는 쓰지 않는다.
- 사용자가 요청하지 않으면 프레임워크나 빌드 도구를 도입하지 않는다.

## 3. 코딩 컨벤션

- 시맨틱 HTML5 요소, `lang="ko"`(또는 페이지 언어), 올바른 `<meta charset>`과 `<meta name="viewport">`, 이미지 `alt` 텍스트.
- 모바일 우선 반응형 CSS. 데스크톱(1440)과 모바일(390) 너비를 확인한다.
- 색상, 폰트, 간격은 `references/web/<task_name>/analysis.md`의 Recommendations를 따라 `:root`의 CSS 변수로 정의한다.
- 로컬과 GitHub Pages 모두에서 동작하도록 상대 경로만 쓴다(프로젝트 사이트는 `/<task_name>/` 아래에 있으므로 `/`로 시작하는 경로는 쓰지 않는다).
- 자유롭게 쓸 수 있는 이미지와 폰트만 사용한다. 레퍼런스 스크린샷이나 레퍼런스 사이트의 코드, 텍스트, 이미지는 재사용하지 않는다.
- 애니메이션은 `prefers-reduced-motion`을 존중한다.

## 4. 라이브러리 (애니메이션 등)

- 순수 CSS/JS를 우선한다. 애니메이션 등 명확히 필요할 때만 라이브러리를 추가한다.
- 라이브러리는 직접 설치하고 **파일을 `output/web/<task_name>/lib/`에 내려받아 저장**한다(예: 임시 폴더에서 `npm pack`/`npm install` 후 dist 파일 복사, 또는 릴리스 파일 다운로드). 상대 경로로 참조하며 런타임에 CDN 링크에 의존하지 않는다.
- 라이선스 파일이 있으면 라이브러리 옆에 함께 둔다.
- 설치 후 사용자에게 **보고**한다: 라이브러리 이름, 버전, 사용 용도, 저장 위치.

## 5. 배포 전 점검

- 페이지를 로컬에서 열거나 서빙하여 콘솔 오류 없이 로드되고 모든 상대 경로가 동작하는지 확인한다.
- 데스크톱과 모바일 너비에서 텍스트와 요소의 넘침·겹침이 없는지 확인한다.

## 6. 배포 (GitHub Pages, 확인 없이 바로 진행)

- 사용자에게 확인을 구하지 않고 바로 배포한다.
- 절차(`gh` CLI와 `git` 사용, `output/web/<task_name>/`의 내용이 레포지터리 루트가 된다):
  1. `gh auth status`를 확인한다. 로그인되어 있지 않으면 중단하고 사용자에게 보고한다.
  2. 같은 계정에 `task_name` 레포가 이미 있으면 덮어쓰지 않고 `task_name_v2`(이후 `_v3`, ...)로 배포한다.
  3. `task_name` 이름의 public 레포를 만든다(무료 플랜의 GitHub Pages는 public 레포가 필요하다). 폴더에서 git을 초기화하고 커밋한 뒤 `main`에 push한다.
  4. `main` 브랜치 루트 폴더 기준으로 GitHub Pages를 활성화하고 배포가 끝날 때까지 기다린다.
  5. 배포된 URL을 열어 응답(HTTP 200)을 확인한다.
- 배포 URL 형식: `https://<계정>.github.io/<레포>/`.
- 비밀 정보나 페이지와 무관한 파일(임시 폴더, `node_modules`, `.env`)은 push하지 않는다. 필요하면 `.gitignore`를 추가한다.
- 사용자에게 최종 보고: 배포 URL(링크), 레포지터리 URL, 설치한 라이브러리 목록(이름, 버전, 용도).
