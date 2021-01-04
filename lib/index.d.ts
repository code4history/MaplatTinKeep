import { Feature, Polygon, Point as TurfPoint, Position, FeatureCollection } from "@turf/turf";
declare type VertexMode = "plain" | "birdeye";
declare type StrictMode = "strict" | "auto" | "loose";
declare type YaxisMode = "follow" | "invert";
declare type StrictStatus = "strict" | "strict_error" | "loose";
declare type Point = [[number, number], [number, number]];
declare type Centroid = {
    forw: Feature<TurfPoint>;
    bakw: Feature<TurfPoint>;
};
declare type Tins = {
    forw: FeatureCollection<Polygon>;
    bakw?: FeatureCollection<Polygon>;
};
export interface Options {
    bounds: [number, number][];
    wh: [number, number];
    vertexMode: VertexMode;
    strictMode: StrictMode;
    yaxisMode: YaxisMode;
    importance: number;
    priority: number;
    stateFull: boolean;
    points: Point[];
    edges: any[];
}
declare class Tin {
    static VERTEX_PLAIN: "plain";
    static VERTEX_BIRDEYE: "birdeye";
    static MODE_STRICT: "strict";
    static MODE_AUTO: "auto";
    static MODE_LOOSE: "loose";
    static STATUS_STRICT: "strict";
    static STATUS_ERROR: "strict_error";
    static STATUS_LOOSE: "loose";
    static YAXIS_FOLLOW: "follow";
    static YAXIS_INVERT: "invert";
    bounds?: [number, number][];
    boundsPolygon?: Feature<Polygon>;
    centroid?: Centroid;
    edgeNodes: any;
    edges: any;
    importance: number;
    indexedTins: any;
    kinks: any;
    points: Point[];
    pointsWeightBuffer: any;
    priority: number;
    stateBackward: any;
    stateFull: boolean;
    stateTriangle: any;
    strictMode: StrictMode;
    strict_status?: StrictStatus;
    tins?: Tins;
    vertexMode?: VertexMode;
    vertices_params: any;
    wh?: [number, number];
    xy?: [number, number];
    yaxisMode: YaxisMode;
    pointsSet: any;
    constructor(options?: Partial<Options>);
    setPoints(points: Point[]): void;
    setEdges(edges: any): void;
    setBounds(bounds: [number, number][]): void;
    setCompiled(compiled: any): {
        tins: Tins | undefined;
        strict_status: "strict" | "loose" | "strict_error" | undefined;
        weight_buffer: any;
        vertices_params: any;
        centroid: Centroid | undefined;
        kinks: any;
    };
    getCompiled(): {};
    addIndexedTin(): void;
    setWh(wh: any): void;
    setVertexMode(mode: any): void;
    setStrictMode(mode: any): void;
    calcurateStrictTinAsync(): Promise<void>;
    generatePointsSet(): {
        forw: FeatureCollection<import("@turf/helpers").Geometry, import("@turf/helpers").Properties>;
        bakw: FeatureCollection<import("@turf/helpers").Geometry, import("@turf/helpers").Properties>;
        edges: any[];
    };
    updateTinAsync(): Promise<unknown>;
    transform(apoint: [any, any], backward?: boolean, ignoreBounds?: boolean): false | Position;
    calculatePointsWeightAsync(): Promise<void>;
}
export default Tin;
