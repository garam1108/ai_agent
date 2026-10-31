# Browser Control Rule v1

Rules for deciding when to control a web browser with the Playwright MCP (`mcp__playwright__*` tools).

## 1. Automatic call (keyword trigger)

- If the user's chat message contains a trigger keyword, call the Playwright MCP automatically, without asking for confirmation.
- Trigger keywords (Korean and English variants):
  - 브라우저를 열어서 작업 / 브라우저 열어서 / 브라우저를 열어
  - 웹 제어 / 웹 브라우저 제어
  - 직접 작업 / 직접 해줘
  - open the browser / control the browser / control the web / work in the browser
- Match by meaning, not only by exact wording (e.g. "브라우저로 직접 들어가서 해줘" also counts).

## 2. Call after consent (no keyword)

- If the user did not use a trigger keyword but the Playwright MCP would clearly help (e.g. a task that needs a live web page, form filling, clicking, screenshots, or checking a rendered page), ask the user for consent first.
- State briefly why the browser control would help and what will be done.
- Call the Playwright MCP only after the user agrees. If the user declines, use another approach.

## 3. Working conventions

- Load the Playwright MCP tool schemas (via ToolSearch) before calling them.
- After navigating, check the page state with `browser_snapshot` before interacting.
- Avoid actions that trigger browser dialogs unexpectedly; handle them with `browser_handle_dialog` if they appear.
- Do not submit forms, make purchases, or send messages on external services without the user's explicit approval.
- When finished, close the browser (`browser_close`) and report the result to the user.
