# GstarCAD MCP 서버 (한글 번역본)

로컬에 설치된 지스타캐드(GstarCAD 2023 스탠다드에서 테스트됨)를 COM 자동화 인터페이스(`GStarCAD.Application`)로 Claude Code에서 제어할 수 있게 해 주는 MCP 서버입니다.

## 요구 사항

- 지스타캐드가 설치된 Windows
- Python 3.10 이상 (3.13에서 테스트됨)
- `pip install -r requirements.txt` (`mcp<2`, `pywin32`)

2.x에서 `FastMCP`가 `MCPServer`로 이름이 바뀌었기 때문에 `mcp`는 2.x 미만으로 고정되어 있습니다.

## 등록

이 프로젝트에는 `.mcp.json`에 이미 등록되어 있습니다. 다시 등록하려면:

```
claude mcp add gstarcad --scope project -- python <절대 경로>\mcp-servers\gstarcad\server.py
```

등록 후에는 도구가 로드되도록 Claude Code 세션을 재시작하세요.

## 도구

| 도구 | 설명 |
| --- | --- |
| `status` | 앱 버전, 열린 도면, 활성 도면 |
| `new_drawing` | 새 빈 도면 생성 |
| `open_drawing` | 절대 경로로 .dwg/.dxf 열기 |
| `drawing_info` | 객체 수, 레이어 수, 경로 |
| `list_layers` / `create_layer` | 레이어 조회 또는 추가 |
| `draw_line` / `draw_circle` / `draw_polyline` / `draw_text` | 모형 공간에 그리기 |
| `list_entities` | 유형/레이어 필터로 객체 목록 조회 (최대 200개) |
| `get_entity` / `delete_entity` | 핸들로 객체 속성 읽기 또는 삭제 |
| `zoom_extents` | 활성 뷰를 전체 범위로 확대 |
| `save_drawing` | 저장 또는 `save_as_path`로 다른 이름 저장 |

모든 도면 도구는 선택 인자 `drawing`(도면 이름)을 받습니다. 비어 있으면 활성 도면을 사용하므로, 도면이 여러 개 열려 있을 때는 이름을 명시적으로 넘기세요.

## 참고

- 지스타캐드가 실행 중이 아니면 서버가 실행합니다.
- `list_entities`는 `limit`개를 찾으면 스캔을 멈추므로 매우 큰 도면에서도 빠릅니다.
- 그리기 도구는 열린 도면을 수정하지만 저장하지는 않습니다. `save_drawing`을 명시적으로 호출하세요.
