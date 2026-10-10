---
name: mk-ppt
description: Project-specific skill for creating, reading, and editing PowerPoint (.pptx) files with python-pptx. Always use this skill when the user mentions PPT, PowerPoint, slides, presentation material, a deck, or .pptx creation/editing/text extraction/table·chart·image insertion/slide deletion·duplication·reordering, even if the file format is not stated. Works only inside the current project (ai_agent).
---

# mk-ppt: Working with PPT via python-pptx

This skill defines the procedure and recipes to follow when handling `.pptx` files inside the `ai_agent` project.
python-pptx has no rendering engine, so the default flow is "write code -> run it -> re-read the structure to verify".

## 0. Preparation

1. Check installation: `python -c "import pptx; print(pptx.__version__)"` (if missing, `pip install python-pptx`)
2. Output location: unless the user specifies one, save to the `output/` folder at the project root. Create it if absent.
3. When modifying an existing file, do not overwrite the original; save under a new name (`_v2`, etc.), because the operation is irreversible.
4. For recurring operations (deleting/duplicating/reordering slides, adding tables/charts, dumping structure), import `scripts/pptx_helpers.py`. It provides already-verified code for features missing from the official python-pptx API.

```python
import sys
sys.path.insert(0, ".claude/skills/mk-ppt/scripts")
from pptx_helpers import *
```

## 1. Workflow

1. **Understand the request**: topic, slide count, audience, template, language, save path. If ambiguous, pick sensible defaults (16:9, title + body structure) and mention them in the final report.
2. **Outline first**: before writing code, briefly list each slide's title and key content. One message per slide.
3. **Write and run code**: use the recipes below. Keep temporary scripts in the scratchpad or `output/` so the project stays tidy.
4. **Verify**: re-read shapes and text per slide with `dump_presentation(path)` and check for omissions, empty placeholders, and shapes outside the slide. If visual checking is needed, convert to PDF (`soffice --headless --convert-to pdf`) only when LibreOffice is available. Otherwise report honestly that visual verification was not done.
5. **Report**: briefly state the save path, slide count, outline summary, and anything not verified.

## 2. Core recipes

### New presentation / open / save
```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
prs = Presentation()                      # default template (4:3)
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)   # change to 16:9
prs = Presentation("input.pptx")          # open an existing file (.potx templates also work)
prs.save("output/result.pptx")
```
Default template layouts: 0 Title, 1 Title+Content, 2 Section Header, 3 Two Content, 4 Comparison, 5 Title Only, 6 Blank, 7 Content+Caption, 8 Picture+Caption.
Changing to 16:9 does not auto-adjust the default template's placeholder positions, so place shapes manually or use a template file.

### Slides and placeholders
```python
s = prs.slides.add_slide(prs.slide_layouts[1])
s.shapes.title.text = "Title"
body = s.placeholders[1].text_frame
body.text = "First line"
p = body.add_paragraph(); p.text = "Sub item"; p.level = 1
s.notes_slide.notes_text_frame.text = "Speaker notes"
```

### Text formatting
```python
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
tb = s.shapes.add_textbox(Inches(1), Inches(1), Inches(6), Inches(1))
tf = tb.text_frame; tf.word_wrap = True
r = tf.paragraphs[0].add_run(); r.text = "Emphasis"
r.font.size = Pt(24); r.font.bold = True; r.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
r.hyperlink.address = "https://example.com"
tf.paragraphs[0].alignment = PP_ALIGN.CENTER
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
```
Specify Korean fonts explicitly, e.g. `r.font.name = "맑은 고딕"`. Without it, fonts may break depending on the environment.

### Shapes / lines / groups
```python
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
sh = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1), Inches(2), Inches(3), Inches(1))
sh.fill.solid(); sh.fill.fore_color.rgb = RGBColor(0x2E, 0x75, 0xB6)
sh.line.color.rgb = RGBColor(255, 255, 255); sh.line.width = Pt(1.5)
sh.text_frame.text = "Step 1"
ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(4), Inches(2.5), Inches(5), Inches(2.5))
grp = s.shapes.add_group_shape()      # add into the group via grp.shapes.add_shape(...)
```

### Pictures / video
```python
s.shapes.add_picture("img.png", Inches(1), Inches(1), width=Inches(4))   # height keeps the ratio
s.shapes.add_movie("clip.mp4", Inches(1), Inches(1), Inches(4), Inches(3), poster_frame_image="poster.png")
```

### Tables
The `add_table(slide, rows_data, left, top, width, height, header=True)` helper builds a table straight from a 2D list. Handling it directly:
```python
t = s.shapes.add_table(3, 3, Inches(1), Inches(2), Inches(8), Inches(2)).table
t.cell(0, 0).text = "Item"
t.cell(0, 0).merge(t.cell(0, 1))       # merge cells
t.columns[0].width = Inches(3)
```

### Charts
Use the `add_chart(slide, kind, categories, series_dict, left, top, width, height, title=None)` helper. Handling it directly:
```python
from pptx.chart.data import CategoryChartData, XyChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
cd = CategoryChartData(); cd.categories = ["Q1", "Q2"]; cd.add_series("Sales", (10, 20))
gf = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1), Inches(2), Inches(8), Inches(4), cd)
ch = gf.chart; ch.has_legend = True; ch.legend.position = XL_LEGEND_POSITION.BOTTOM
ch.plots[0].has_data_labels = True
ch.replace_data(new_chart_data)        # replace existing chart data
```
Supported kinds: bar, horizontal bar, line, pie, doughnut, area, scatter (XY), bubble, radar, stock.

### Slide management (provided by helpers)
- `delete_slide(prs, index)`, `move_slide(prs, old, new)`, `duplicate_slide(prs, index)`
- These three have no official API and manipulate internal XML. Use the helpers instead of writing them yourself.
- When deleting, the relationship (rel) must be cut too, or orphan parts remain in the file. The helper handles this.

### Reading / extraction
- `dump_presentation(path)`: prints per-slide layout, shape kinds, positions, text, and notes
- `extract_text(path)`: returns all text as a list in slide order
- Extract pictures via `shape.image.blob`, tables via `shape.table`, charts via `shape.chart.plots`.
- Identify shape kind with `shape.shape_type`, and placeholder status with `shape.is_placeholder`.

## 3. Design guide (to avoid awkward results)

- Margins of 0.5 inch or more, titles 28-40pt, body 18pt or more. Limit body text to about 6 lines per slide.
- Limit colors to one primary, one or two secondary, and neutrals. Define them as constants at the top so the color scheme does not drift between slides.
- Write all shape coordinates in `Inches`/`Pt`, and check they fit inside the slide size (`prs.slide_width/height`).
- If text may overflow, shorten it or try `tf.fit_text(font_family=..., max_size=...)`. `fit_text` works only if that font file exists on the system.
- When a template is given, prefer its layouts and placeholders over drawing new shapes.

## 4. Limits (state them first and offer alternatives)

Things python-pptx **cannot** do: PDF/image conversion and rendering, reading legacy `.ppt`, creating animations and transitions, creating SmartArt, VBA macros, comments and co-editing.
- If asked for animations or transitions, direct XML injection is possible, but tell the user the file may become corrupted in PowerPoint and proceed only after getting confirmation.
- For `.ppt`, advise converting to `.pptx` first.

## 5. Common problems

| Symptom | Cause and fix |
|---|---|
| `KeyError` or `IndexError` when accessing a placeholder | Placeholder idx differs per layout. Check with `[(p.placeholder_format.idx, p.name) for p in slide.placeholders]` |
| Korean shows as boxes | Font not specified. Set `font.name` explicitly |
| An empty "Click to add text" box remains | Remove unused placeholders with `sp = ph._element; sp.getparent().remove(sp)` |
| File shows a repair message in PowerPoint | Mostly caused by direct XML manipulation. Revert the last XML change and check |
| Korean garbled in console output (Windows) | Set `PYTHONIOENCODING=utf-8` or call `sys.stdout.reconfigure(encoding="utf-8")`. Running `python pptx_helpers.py file.pptx` from the CLI applies it automatically |
| `PermissionError` on save | The same file is open in PowerPoint. Close it or save under another name |
