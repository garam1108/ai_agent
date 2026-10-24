# GstarCAD MCP Server

MCP server that lets Claude Code control a locally installed GstarCAD (tested with GstarCAD 2023 Standard) through its COM automation interface (`GStarCAD.Application`).

## Requirements

- Windows with GstarCAD installed
- Python 3.10+ (tested with 3.13)
- `pip install -r requirements.txt` (`mcp<2`, `pywin32`)

`mcp` is pinned below 2.x because 2.x renamed `FastMCP` to `MCPServer`.

## Registration

Already registered for this project in `.mcp.json`. To register it again:

```
claude mcp add gstarcad --scope project -- python <absolute path to>\mcp-servers\gstarcad\server.py
```

Restart the Claude Code session after registering so the tools are loaded.

## Tools

| Tool | Description |
| --- | --- |
| `status` | App version, open drawings, active drawing |
| `new_drawing` | Create a new empty drawing |
| `open_drawing` | Open a .dwg/.dxf by absolute path |
| `drawing_info` | Entity count, layer count, path |
| `list_layers` / `create_layer` | Read or add layers |
| `draw_line` / `draw_circle` / `draw_polyline` / `draw_text` | Draw in model space |
| `list_entities` | List entities with type/layer filter (max 200) |
| `get_entity` / `delete_entity` | Read or delete an entity by handle |
| `zoom_extents` | Zoom the active view to extents |
| `save_drawing` | Save, or save a copy via `save_as_path` |

Every drawing tool takes an optional `drawing` argument (drawing name). When empty, the active drawing is used, so pass the name explicitly when working with several open drawings.

## Notes

- If GstarCAD is not running, the server launches it.
- `list_entities` stops scanning after `limit` matches, so it stays fast on very large drawings.
- Drawing tools modify the live drawing but do not save it. Call `save_drawing` explicitly.
