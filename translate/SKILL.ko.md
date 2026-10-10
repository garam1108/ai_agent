---
name: mk-ppt
description: python-pptx로 PowerPoint(.pptx) 파일을 만들고, 읽고, 수정하는 프로젝트 전용 스킬. 사용자가 PPT, 파워포인트, 슬라이드, 발표자료, 덱(deck), .pptx 생성/편집/텍스트 추출/표·차트·이미지 삽입/슬라이드 삭제·복제·순서 변경 등을 언급하면, 파일 형식을 명시하지 않았더라도 반드시 이 스킬을 사용할 것. 현재 프로젝트(ai_agent) 안에서만 동작한다.
---

# mk-ppt: python-pptx로 PPT 작업하기

이 스킬은 `ai_agent` 프로젝트 안에서 `.pptx`를 다룰 때 따르는 작업 절차와 레시피다.
python-pptx는 렌더링 엔진이 없으므로, "코드를 쓰고 → 실행하고 → 구조를 다시 읽어 검증"하는 흐름을 기본으로 한다.

## 0. 작업 전 준비

1. 설치 확인: `python -c "import pptx; print(pptx.__version__)"` (미설치 시 `pip install python-pptx`)
2. 산출물 위치: 사용자가 지정하지 않으면 프로젝트 루트의 `output/` 폴더에 저장한다. 폴더가 없으면 만든다.
3. 기존 파일을 수정할 때는 원본을 덮어쓰지 말고 새 이름(`_v2` 등)으로 저장한다. 되돌릴 수 없는 작업이기 때문이다.
4. 반복되는 작업(슬라이드 삭제·복제·순서 변경, 표·차트 추가, 구조 덤프)은 `scripts/pptx_helpers.py`를 import해서 쓴다. python-pptx 공식 API에 없는 기능을 이미 검증된 코드로 제공하기 때문이다.

```python
import sys
sys.path.insert(0, ".claude/skills/mk-ppt/scripts")
from pptx_helpers import *
```

## 1. 작업 절차

1. **요구 파악**: 주제, 슬라이드 수, 대상 청중, 템플릿 유무, 언어, 저장 경로. 모호하면 합리적 기본값(16:9, 제목+본문 구조)을 정하고 결과 보고 때 알린다.
2. **구성안 먼저**: 코드 작성 전에 슬라이드별 제목과 핵심 내용을 짧게 정리한다. 슬라이드 한 장에는 메시지 하나만 담는다.
3. **코드 작성·실행**: 아래 레시피를 사용한다. 임시 스크립트는 프로젝트를 어지럽히지 않게 scratchpad나 `output/`에 둔다.
4. **검증**: `dump_presentation(path)`로 슬라이드별 도형·텍스트를 다시 읽어 누락, 빈 플레이스홀더, 화면 밖으로 나간 도형을 확인한다. 시각 확인이 필요하면 LibreOffice(`soffice --headless --convert-to pdf`)가 있을 때만 PDF로 변환해 본다. 없으면 시각 검증은 못 했다고 솔직히 보고한다.
5. **보고**: 저장 경로, 슬라이드 수, 구성 요약, 검증하지 못한 항목을 짧게 알린다.

## 2. 핵심 레시피

### 새 프레젠테이션 / 열기 / 저장
```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
prs = Presentation()                      # 기본 템플릿(4:3)
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)   # 16:9로 변경
prs = Presentation("input.pptx")          # 기존 파일 열기 (.potx 템플릿도 가능)
prs.save("output/result.pptx")
```
기본 템플릿 레이아웃: 0 제목, 1 제목+내용, 2 섹션 헤더, 3 두 내용, 4 비교, 5 제목만, 6 빈 화면, 7 내용+캡션, 8 그림+캡션.
16:9로 바꾸면 기본 템플릿의 플레이스홀더 위치는 자동 조정되지 않으므로, 도형을 직접 배치하거나 템플릿 파일을 쓴다.

### 슬라이드와 플레이스홀더
```python
s = prs.slides.add_slide(prs.slide_layouts[1])
s.shapes.title.text = "제목"
body = s.placeholders[1].text_frame
body.text = "첫 줄"
p = body.add_paragraph(); p.text = "하위 항목"; p.level = 1
s.notes_slide.notes_text_frame.text = "발표자 노트"
```

### 텍스트 서식
```python
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
tb = s.shapes.add_textbox(Inches(1), Inches(1), Inches(6), Inches(1))
tf = tb.text_frame; tf.word_wrap = True
r = tf.paragraphs[0].add_run(); r.text = "강조"
r.font.size = Pt(24); r.font.bold = True; r.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
r.hyperlink.address = "https://example.com"
tf.paragraphs[0].alignment = PP_ALIGN.CENTER
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
```
한글 글꼴은 `r.font.name = "맑은 고딕"`처럼 명시한다. 지정하지 않으면 환경에 따라 글꼴이 깨질 수 있다.

### 도형 / 선 / 그룹
```python
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
sh = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1), Inches(2), Inches(3), Inches(1))
sh.fill.solid(); sh.fill.fore_color.rgb = RGBColor(0x2E, 0x75, 0xB6)
sh.line.color.rgb = RGBColor(255, 255, 255); sh.line.width = Pt(1.5)
sh.text_frame.text = "단계 1"
ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(4), Inches(2.5), Inches(5), Inches(2.5))
grp = s.shapes.add_group_shape()      # grp.shapes.add_shape(...)로 그룹 안에 추가
```

### 그림 / 동영상
```python
s.shapes.add_picture("img.png", Inches(1), Inches(1), width=Inches(4))   # 높이는 비율 유지
s.shapes.add_movie("clip.mp4", Inches(1), Inches(1), Inches(4), Inches(3), poster_frame_image="poster.png")
```

### 표
`add_table(slide, rows_data, left, top, width, height, header=True)` 헬퍼를 쓰면 2차원 리스트로 바로 표가 만들어진다. 직접 다룰 때:
```python
t = s.shapes.add_table(3, 3, Inches(1), Inches(2), Inches(8), Inches(2)).table
t.cell(0, 0).text = "항목"
t.cell(0, 0).merge(t.cell(0, 1))       # 셀 병합
t.columns[0].width = Inches(3)
```

### 차트
`add_chart(slide, kind, categories, series_dict, left, top, width, height, title=None)` 헬퍼 사용. 직접 다룰 때:
```python
from pptx.chart.data import CategoryChartData, XyChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
cd = CategoryChartData(); cd.categories = ["1분기", "2분기"]; cd.add_series("매출", (10, 20))
gf = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1), Inches(2), Inches(8), Inches(4), cd)
ch = gf.chart; ch.has_legend = True; ch.legend.position = XL_LEGEND_POSITION.BOTTOM
ch.plots[0].has_data_labels = True
ch.replace_data(new_chart_data)        # 기존 차트 데이터 교체
```
지원 종류: 막대, 가로막대, 선, 원, 도넛, 영역, 분산형(XY), 거품형, 방사형, 주식형.

### 슬라이드 관리 (헬퍼 제공)
- `delete_slide(prs, index)`, `move_slide(prs, old, new)`, `duplicate_slide(prs, index)`
- 이 셋은 공식 API가 없어 내부 XML을 조작한다. 직접 짜지 말고 헬퍼를 쓴다.
- 삭제할 때는 관계(rel)까지 끊어야 파일에 고아 파트가 남지 않는다. 헬퍼가 처리한다.

### 읽기 / 추출
- `dump_presentation(path)`: 슬라이드별 레이아웃, 도형 종류, 위치, 텍스트, 노트를 출력
- `extract_text(path)`: 모든 텍스트를 슬라이드 순서대로 리스트로 반환
- 그림 추출은 `shape.image.blob`, 표는 `shape.table`, 차트는 `shape.chart.plots`로 접근한다.
- 도형 종류 판별: `shape.shape_type`, 플레이스홀더 여부: `shape.is_placeholder`.

## 3. 디자인 가이드 (결과물이 어색해지지 않게)

- 여백 0.5인치 이상, 제목 28~40pt, 본문 18pt 이상. 한 슬라이드 본문은 6줄 안팎으로 제한한다.
- 색은 주 색 1개, 보조 색 1~2개, 중립색으로 제한한다. 슬라이드마다 색 체계가 달라지지 않게 상단에 상수로 정의한다.
- 모든 도형 좌표는 `Inches`/`Pt`로 쓰고, 슬라이드 크기(`prs.slide_width/height`) 안에 들어오는지 확인한다.
- 텍스트가 넘칠 가능성이 있으면 글자 수를 줄이거나 `tf.fit_text(font_family=..., max_size=...)`를 시도한다. `fit_text`는 해당 글꼴 파일이 시스템에 있어야 동작한다.
- 템플릿이 주어지면 새 도형을 그리기보다 템플릿의 레이아웃과 플레이스홀더를 우선 사용한다.

## 4. 한계 (먼저 알리고 대안 제시)

python-pptx로 **할 수 없는** 것: PDF/이미지 변환과 렌더링, 구버전 `.ppt` 읽기, 애니메이션과 전환 효과 생성, SmartArt 생성, VBA 매크로, 댓글과 공동 편집.
- 애니메이션이나 전환을 요청받으면 XML 직접 주입이 가능하지만 PowerPoint에서 파일이 손상될 위험이 있음을 알리고 사용자 확인을 받은 뒤 진행한다.
- `.ppt`는 먼저 `.pptx`로 변환해야 한다고 안내한다.

## 5. 자주 만나는 문제

| 증상 | 원인과 해결 |
|---|---|
| `KeyError` 또는 `IndexError`로 플레이스홀더 접근 실패 | 레이아웃마다 플레이스홀더 idx가 다르다. `[(p.placeholder_format.idx, p.name) for p in slide.placeholders]`로 확인 |
| 한글이 네모로 보임 | 글꼴 미지정. `font.name`을 명시 |
| 비어 있는 "텍스트를 입력하려면 클릭" 상자가 남음 | 쓰지 않은 플레이스홀더는 `sp = ph._element; sp.getparent().remove(sp)`로 제거 |
| 파일이 PowerPoint에서 복구 메시지를 띄움 | XML 직접 조작이 원인인 경우가 대부분. 마지막으로 추가한 XML 변경을 되돌려 확인 |
| 콘솔 출력의 한글이 깨짐 (Windows) | `PYTHONIOENCODING=utf-8`을 지정하거나 `sys.stdout.reconfigure(encoding="utf-8")` 호출. CLI로 `python pptx_helpers.py 파일.pptx`를 쓰면 자동 적용 |
| 저장 시 `PermissionError` | 같은 파일이 PowerPoint에서 열려 있음. 닫거나 다른 이름으로 저장 |
