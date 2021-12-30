const Cesium = require("cesiumSource/Cesium");
// Import @types/cesium to use along with CesiumJS
import { MapboxImageryProvider } from "cesium";
import MVTImageryProvider from "../src";
import TerrainProvider from "@macrostrat/cesium-martini";
import { useRef, useEffect } from "react";
import h from "@macrostrat/hyper";
import { ImageryLayer, useCesium } from "resium";
import CesiumViewer, { DisplayQuality } from "@macrostrat/cesium-viewer";

const terrainProvider = new TerrainProvider({
  // @ts-ignore
  hasVertexNormals: false,
  hasWaterMask: false,
  accessToken: process.env.MAPBOX_API_TOKEN,
  highResolution: true,
  credit: "Mapbox",
});

function BaseLayer({ enabled = true, style, accessToken, ...rest }) {
  console.log(style);
  const provider = useRef(
    new MVTImageryProvider({
      style,
      maximumZoom: 15,
      tileSize: 512,
      accessToken: process.env.MAPBOX_API_TOKEN,
    })
  );

  return h(ImageryLayer, { imageryProvider: provider.current, ...rest });
}

//const terrainProvider2 = createWorldTerrain();

function Inspector() {
  const { viewer } = useCesium();
  useEffect(() => {
    if (viewer == null) return;
    viewer.extend(Cesium.viewerCesiumInspectorMixin, {});
    viewer.scene.requestRenderMode = true;
    viewer.scene.debugShowFramesPerSecond = true;
  }, [viewer]);
  return null;
}

function CesiumView({ style, accessToken }) {
  return h(
    CesiumViewer,
    {
      terrainProvider,
      displayQuality: DisplayQuality.High,
    },
    [h(BaseLayer, { style, accessToken }), h(Inspector)]
  );
}

export default CesiumView;
