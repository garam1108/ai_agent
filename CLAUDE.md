# CLAUDE.md

## User

- Name: Garam (가람)

## Language rule

- Always reply in Korean (한글), no matter what language the user writes in (English, Korean, or any other language).

## Markdown file rules

- Write every `.md` file in English.
- For every `.md` file written, save a Korean translation in `C:\Users\SBS\Desktop\ai_agent\translate`, named `<original name>.ko.md` (e.g. `CLAUDE.md` -> `translate/CLAUDE.ko.md`).
- Keep translations in sync:
  - Whenever an `.md` file is modified, check what changed and apply the same changes to its translation.
  - Whenever an `.md` file is deleted, delete its translation as well.
  - Before finishing a task that touched any `.md` file, verify the `translate` folder matches the current state.
