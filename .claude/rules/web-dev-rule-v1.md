# Web Dev Rule v1

Rules to follow whenever web page code is written (used by the `developer` agent).

## 1. Naming

- `task_name` is the task/topic name in lowercase English, hyphen or underscore separated (e.g. `camping-guide`). It is the same as the topic slug used in `references/web/<task_name>/` and `output/web/<task_name>/`.
- The GitHub repository name is exactly `task_name`.

## 2. Code structure (html / css / js)

- The base structure is plain HTML, CSS, and JavaScript:

```
output/web/<task_name>/
  index.html
  css/style.css
  js/main.js
  img/            (images used by the page)
  lib/            (downloaded libraries, see section 4)
```

- Extra pages go next to `index.html` as `<page>.html`. Split CSS/JS into more files only when needed, inside `css/` and `js/`.
- Link CSS in `<head>` and JS before `</body>` (or with `defer`). No inline `<style>`/`<script>` blocks except tiny ones.
- Do not introduce a framework or build tool unless the user asks for it.

## 3. Coding conventions

- Semantic HTML5 elements, `lang="ko"` (or the page language), proper `<meta charset>` and `<meta name="viewport">`, `alt` text on images.
- Mobile-first responsive CSS; check desktop (1440) and mobile (390) widths.
- Define colors, fonts, and spacing as CSS variables on `:root`, taken from the Recommendations in `references/web/<task_name>/analysis.md`.
- Use all relative paths so the page works both locally and on GitHub Pages (a project site lives under `/<task_name>/`, so never use paths starting with `/`).
- Use only images and fonts that are free to use. Never reuse reference screenshots or reference site code, text, or images.
- Respect `prefers-reduced-motion` for animations.

## 4. Libraries (animation etc.)

- Prefer plain CSS/JS. Add a library only when it is clearly needed (e.g. animation).
- Install the library yourself, and **download the files into `output/web/<task_name>/lib/`** (e.g. via `npm pack`/`npm install` in a scratch folder and copy the dist files, or by downloading the release file). Reference them with relative paths. Do not depend on a CDN link at runtime.
- Keep each library's license file next to it when one exists.
- After installing, **report to the user**: library name, version, what it is used for, and where it is stored.

## 5. Check before deploy

- Open or serve the page locally and confirm it loads without console errors and that all relative paths work.
- Confirm there is no overflow or overlap of text and elements at desktop and mobile widths.

## 6. Deployment (GitHub Pages, no confirmation needed)

- Deploy directly without asking the user for confirmation.
- Steps (use `gh` CLI and `git`; the contents of `output/web/<task_name>/` become the repository root):
  1. Check `gh auth status`. If not logged in, stop and report to the user.
  2. If a repository named `task_name` already exists on the account, do not overwrite it: deploy to `task_name_v2` (then `_v3`, ...) instead.
  3. Create a public repository named `task_name` (GitHub Pages on the free plan needs a public repo), initialize git in the folder, commit, and push to `main`.
  4. Enable GitHub Pages from the `main` branch, root folder, then wait until the deployment finishes.
  5. Open the deployed URL and check that it responds (HTTP 200).
- Deployed URL format: `https://<account>.github.io/<repository>/`.
- Never push secrets or files unrelated to the page (scratch folders, `node_modules`, `.env`). Add a `.gitignore` when needed.
- Final report to the user: the deployed URL as a link, the repository URL, and the list of installed libraries (name, version, purpose).
