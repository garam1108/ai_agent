# PPT Rule v1

Rules to follow whenever a PowerPoint (.pptx) file is created.

## 1. Slide count

- The default number of slides is **8**.
- If the user explicitly specifies a different number of slides, follow the user's request.

## 2. Design reference

- Before building, read the design-related `.md` file(s) provided by the user and base the design (colors, fonts, layout, tone) on them.
- If no design `.md` file has been provided, ask the user for one before building.

## 3. Layout quality (no overflow, no overlap)

- Text must never extend beyond the slide boundaries or its own container.
- Text and shapes must never overlap in a way that reduces readability.
- Plan text length, font size, and shape positions so that everything fits with comfortable margins.
- Verification after building:
  1. Render the finished `.pptx` to images (e.g. via PDF conversion) and check every slide.
  2. If any overflow or overlap is found, fix it and render again.
  3. Report the result of the check to the user.
