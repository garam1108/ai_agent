# CLAUDE.md

## User

- Name: Garam (가람)

## Language rule

- Always reply in Korean (한글), no matter what language the user writes in (English, Korean, or any other language).

## Workflow rules

- When the user requests a task by prompt, always draft a related todo list first and report it to the user before doing any work.
- Execute the task only after the user has read the todo list and approved it. Do not start work without approval.
- After finishing a task, if any folder or file was added, reorganize the files and folders into the structure Claude Code recognizes best, then finish. Update the "Folder structure" section and its translation if the structure changed.

## Markdown file rules

- Write every `.md` file in English.
- For every `.md` file written, save a Korean translation in `C:\Users\ICT-Garam\Desktop\agent1004\ai_agent\translate`, named `<original name>.ko.md` (e.g. `CLAUDE.md` -> `translate/CLAUDE.ko.md`).
- Keep translations in sync:
  - Whenever an `.md` file is modified, check what changed and apply the same changes to its translation.
  - Whenever an `.md` file is deleted, delete its translation as well.
  - Before finishing a task that touched any `.md` file, verify the `translate` folder matches the current state.

## Folder structure

- `CLAUDE.md` - project instructions (kept at the repository root).
- `research/` - research result `.md` files (English).
- `report/` - finished report `.docx` files.
- `.claude/skills/mk-ppt/SKILL.md` - python-pptx PPT skill instructions.
- `.claude/skills/mk-ppt/scripts/pptx_helpers.py` - helper functions used by the skill.
- `output/` - generated presentation `.pptx` files and their build scripts.
- `translate/` - Korean translations (`<original name>.ko.md`) of every `.md` file.
- Never overwrite existing files; create a new file name instead (e.g. add a `_v2` suffix).
