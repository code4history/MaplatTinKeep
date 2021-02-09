import { point, } from "@turf/helpers";
export default function kinks(featureIn) {
    let coordinates;
    let feature;
    const results = {
        type: "FeatureCollection",
        features: [],
    };
    if (featureIn.type === "Feature") {
        feature = featureIn.geometry;
    }
    else {
        feature = featureIn;
    }
    if (feature.type === "LineString") {
        coordinates = [feature.coordinates];
    }
    else if (feature.type === "MultiLineString") {
        coordinates = feature.coordinates;
    }
    else if (feature.type === "MultiPolygon") {
        coordinates = [].concat.apply([], feature.coordinates);
    }
    else if (feature.type === "Polygon") {
        coordinates = feature.coordinates;
    }
    else {
        throw new Error("Input must be a LineString, MultiLineString, " +
            "Polygon, or MultiPolygon Feature or Geometry");
    }
    coordinates.forEach((line1) => {
        coordinates.forEach((line2) => {
            for (let i = 0; i < line1.length - 1; i++) {
                for (let k = i; k < line2.length - 1; k++) {
                    if (line1 === line2) {
                        if (Math.abs(i - k) === 1) {
                            continue;
                        }
                        if (i === 0 &&
                            k === line1.length - 2 &&
                            line1[i][0] === line1[line1.length - 1][0] &&
                            line1[i][1] === line1[line1.length - 1][1]) {
                            continue;
                        }
                    }
                    const intersection = lineIntersects(line1[i][0], line1[i][1], line1[i + 1][0], line1[i + 1][1], line2[k][0], line2[k][1], line2[k + 1][0], line2[k + 1][1]);
                    if (intersection) {
                        results.features.push(point([intersection[0], intersection[1]]));
                    }
                }
            }
        });
    });
    return results;
}
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    let a;
    let b;
    const result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false,
    };
    const denominator = (line2EndY - line2StartY) * (line1EndX - line1StartX) -
        (line2EndX - line2StartX) * (line1EndY - line1StartY);
    if (denominator === 0) {
        if (result.x !== null && result.y !== null) {
            return result;
        }
        else {
            return false;
        }
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    const numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
    const numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    result.x = line1StartX + a * (line1EndX - line1StartX);
    result.y = line1StartY + a * (line1EndY - line1StartY);
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    if (result.onLine1 && result.onLine2) {
        return [result.x, result.y];
    }
    else {
        return false;
    }
}
//# sourceMappingURL=kinks.js.map