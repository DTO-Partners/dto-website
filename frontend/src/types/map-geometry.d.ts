declare module "d3-geo" {
  type GeoPoint = [number, number];

  export function geoMercator(): {
    (coordinates: GeoPoint): GeoPoint | null;
    fitExtent(extent: [[number, number], [number, number]], object: unknown): void;
    scale(): number;
    scale(scale: number): ReturnType<typeof geoMercator>;
    translate(translate: GeoPoint): ReturnType<typeof geoMercator>;
    center(center: GeoPoint): ReturnType<typeof geoMercator>;
  };

  export function geoPath(projection: ReturnType<typeof geoMercator>): (object: unknown) => string | null;
  export function geoCentroid(object: unknown): GeoPoint;
  export function geoInterpolate(from: GeoPoint, to: GeoPoint): (t: number) => GeoPoint;
}

declare module "react-svg-worldmap/dist/countries.geo.js" {
  const countriesGeo: {
    features: Array<{
      N: string;
      I: string;
      C: number[][][][];
    }>;
  };

  export default countriesGeo;
}
