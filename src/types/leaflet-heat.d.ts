import "leaflet";

declare module "leaflet" {
  export interface HeatLatLngTuple extends Array<number> {
    0: number; // latitude
    1: number; // longitude
    2: number; // intensity
  }

  export interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  export interface HeatLayer extends Layer {
    setLatLngs(latlngs: HeatLatLngTuple[]): this;
    addLatLng(latlng: HeatLatLngTuple): this;
    setOptions(options: HeatLayerOptions): this;
    redraw(): this;
  }

  export function heatLayer(
    latlngs: HeatLatLngTuple[],
    options?: HeatLayerOptions,
  ): HeatLayer;
}
