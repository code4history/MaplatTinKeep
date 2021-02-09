import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Point, Polygon } from "@turf/helpers";
export default function kinks<T extends LineString | MultiLineString | Polygon | MultiPolygon>(featureIn: Feature<T> | T): FeatureCollection<Point>;
