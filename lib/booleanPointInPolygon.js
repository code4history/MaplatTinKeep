import { getCoord, getGeom } from "@turf/invariant";
const pointInPolygon = require("point-in-polygon-hao").default;
export default function booleanPointInPolygon(point, polygon, options = {}) {
    if (!point) {
        throw new Error("point is required");
    }
    if (!polygon) {
        throw new Error("polygon is required");
    }
    const pt = getCoord(point);
    const geom = getGeom(polygon);
    const type = geom.type;
    const bbox = polygon.bbox;
    let polys = geom.coordinates;
    if (bbox && !inBBox(pt, bbox)) {
        return false;
    }
    if (type === "Polygon") {
        polys = [polys];
    }
    let insidePoly = false;
    for (let i = 0; i < polys.length && !insidePoly; i++) {
        const res = pointInPolygon(pt, polys[i]);
        if ((res === 0 && !options.ignoreBoundary) || res)
            insidePoly = true;
    }
    return insidePoly;
}
function inBBox(pt, bbox) {
    return (bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1]);
}
//# sourceMappingURL=booleanPointInPolygon.js.map