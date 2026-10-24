"""GstarCAD 2023 MCP server (COM automation via pywin32).

Run over stdio. Requires GstarCAD installed on Windows.
"""

import pythoncom
import win32com.client as win32
from mcp.server.fastmcp import FastMCP

PROG_ID = "GStarCAD.Application"
MAX_LIST = 200

mcp = FastMCP("gstarcad")


def _app():
    """Attach to a running GstarCAD, or launch one."""
    pythoncom.CoInitialize()
    try:
        app = win32.GetActiveObject(PROG_ID)
    except Exception:
        app = win32.Dispatch(PROG_ID)
    app.Visible = True
    return app


def _doc(name: str | None = None):
    """Return the named document, or the active one when name is empty."""
    app = _app()
    if not name:
        if app.Documents.Count == 0:
            raise RuntimeError("No drawing is open. Use new_drawing first.")
        return app.ActiveDocument
    for i in range(app.Documents.Count):
        d = app.Documents.Item(i)
        if d.Name.lower() == name.lower():
            return d
    raise RuntimeError(f"Drawing not found: {name}")


def _pt(x: float, y: float, z: float = 0.0):
    return win32.VARIANT(pythoncom.VT_ARRAY | pythoncom.VT_R8, (x, y, z))


@mcp.tool()
def status() -> dict:
    """Connection status: app version and the list of open drawings."""
    app = _app()
    docs = [app.Documents.Item(i).Name for i in range(app.Documents.Count)]
    active = app.ActiveDocument.Name if docs else None
    return {"name": app.Name, "version": app.Version, "drawings": docs, "active": active}


@mcp.tool()
def new_drawing() -> str:
    """Create a new empty drawing and make it active. Returns its name."""
    app = _app()
    doc = app.Documents.Add()
    return doc.Name


@mcp.tool()
def open_drawing(path: str) -> str:
    """Open a .dwg/.dxf file by absolute path. Returns the drawing name."""
    return _app().Documents.Open(path).Name


@mcp.tool()
def drawing_info(drawing: str = "") -> dict:
    """Entity count, layer count and path of a drawing (active when empty)."""
    d = _doc(drawing)
    return {
        "name": d.Name,
        "path": d.FullName,
        "modelspace_entities": d.ModelSpace.Count,
        "layers": d.Layers.Count,
        "saved": d.Saved,
    }


@mcp.tool()
def list_layers(drawing: str = "") -> list[dict]:
    """List layers with color, on/off and freeze state."""
    d = _doc(drawing)
    out = []
    for i in range(d.Layers.Count):
        ly = d.Layers.Item(i)
        out.append({"name": ly.Name, "color": ly.Color, "on": bool(ly.LayerOn), "frozen": bool(ly.Freeze)})
    return out


@mcp.tool()
def create_layer(name: str, color: int = 7, drawing: str = "") -> str:
    """Create a layer (color = ACI index 1-255)."""
    d = _doc(drawing)
    ly = d.Layers.Add(name)
    ly.Color = color
    return f"Layer '{ly.Name}' ready"


def _style(ent, layer: str, color: int | None):
    if layer:
        ent.Layer = layer
    if color is not None:
        ent.Color = color


@mcp.tool()
def draw_line(x1: float, y1: float, x2: float, y2: float, layer: str = "", color: int | None = None, drawing: str = "") -> str:
    """Draw a line in model space."""
    ent = _doc(drawing).ModelSpace.AddLine(_pt(x1, y1), _pt(x2, y2))
    _style(ent, layer, color)
    return f"Line handle={ent.Handle}"


@mcp.tool()
def draw_circle(cx: float, cy: float, radius: float, layer: str = "", color: int | None = None, drawing: str = "") -> str:
    """Draw a circle in model space."""
    ent = _doc(drawing).ModelSpace.AddCircle(_pt(cx, cy), radius)
    _style(ent, layer, color)
    return f"Circle handle={ent.Handle}"


@mcp.tool()
def draw_polyline(points: list[list[float]], closed: bool = False, layer: str = "", color: int | None = None, drawing: str = "") -> str:
    """Draw a 2D lightweight polyline. points = [[x, y], ...]."""
    if len(points) < 2:
        raise ValueError("At least 2 points are required")
    flat = [c for p in points for c in (p[0], p[1])]
    arr = win32.VARIANT(pythoncom.VT_ARRAY | pythoncom.VT_R8, flat)
    ent = _doc(drawing).ModelSpace.AddLightWeightPolyline(arr)
    ent.Closed = closed
    _style(ent, layer, color)
    return f"Polyline handle={ent.Handle}"


@mcp.tool()
def draw_text(x: float, y: float, text: str, height: float = 2.5, layer: str = "", color: int | None = None, drawing: str = "") -> str:
    """Add single-line text in model space."""
    ent = _doc(drawing).ModelSpace.AddText(text, _pt(x, y), height)
    _style(ent, layer, color)
    return f"Text handle={ent.Handle}"


@mcp.tool()
def list_entities(entity_type: str = "", layer: str = "", limit: int = 50, drawing: str = "") -> list[dict]:
    """List model-space entities (first `limit`, max 200).

    Filters: entity_type substring (e.g. 'Line', 'Circle'), exact layer name.
    Large drawings are scanned only until `limit` matches are found.
    """
    limit = max(1, min(limit, MAX_LIST))
    ms = _doc(drawing).ModelSpace
    out = []
    for i in range(ms.Count):
        e = ms.Item(i)
        if entity_type and entity_type.lower() not in e.ObjectName.lower():
            continue
        if layer and e.Layer != layer:
            continue
        out.append({"handle": e.Handle, "type": e.ObjectName, "layer": e.Layer, "color": e.Color})
        if len(out) >= limit:
            break
    return out


@mcp.tool()
def get_entity(handle: str, drawing: str = "") -> dict:
    """Read properties of an entity by handle."""
    e = _doc(drawing).HandleToObject(handle)
    info = {"handle": e.Handle, "type": e.ObjectName, "layer": e.Layer, "color": e.Color}
    for prop in ("StartPoint", "EndPoint", "Center", "Radius", "TextString", "Length", "Area", "Closed"):
        try:
            v = getattr(e, prop)
            info[prop] = list(v) if isinstance(v, tuple) else v
        except Exception:
            pass
    return info


@mcp.tool()
def delete_entity(handle: str, drawing: str = "") -> str:
    """Delete an entity by handle."""
    _doc(drawing).HandleToObject(handle).Delete()
    return f"Deleted {handle}"


@mcp.tool()
def zoom_extents() -> str:
    """Zoom the active view to the drawing extents."""
    _app().ZoomExtents()
    return "ok"


@mcp.tool()
def save_drawing(drawing: str = "", save_as_path: str = "") -> str:
    """Save a drawing; give save_as_path (absolute) to save a copy under a new name."""
    d = _doc(drawing)
    if save_as_path:
        d.SaveAs(save_as_path)
        return f"Saved as {save_as_path}"
    d.Save()
    return f"Saved {d.Name}"


if __name__ == "__main__":
    mcp.run()
