<template>
  <main><div ref="canvas" style="width: 100%; height: 500px"></div></main>
</template>

<script>
// Packages
import Hammer from "hammerjs";
import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
// import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneWADOImageLoader from "../../static/codecs/cornerstoneWADOImageLoader";
import * as cornerstoneTools from "@cornerstonejs/tools";

// Externals
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

// CodeSandbox live updates components in an odd way.
// We do this to protect ourselves from duplicate initializations
if (!cornerstoneWADOImageLoader.initialized) {
  // WadoImageLoader Registration/Config
  const config = {
    webWorkerPath: "/codecs/cornerstoneWADOImageLoaderWebWorker.js",
    taskConfiguration: {
      decodeTask: {
        codecsPath: "/codecs/cornerstoneWADOImageLoaderCodecs.js",
      },
    },
  };
  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
  cornerstoneWADOImageLoader.initialized = true;
}
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  created() {
    cornerstoneTools.init({
      globalToolSyncEnabled: true,
    });
    const WwwcTool = cornerstoneTools.WwwcTool;
    const OverlayTool = cornerstoneTools.OverlayTool;
    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.addTool(OverlayTool);
    cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
    cornerstoneTools.setToolEnabled("Overlay", {});
  },
  mounted() {
    // Enable Canvas
    this.canvas = this.$refs.canvas;
    cornerstone.enable(this.canvas, {
      renderer: "webgl",
    });
    // Load Image
    const codeSandboxProjectUrl = "https://1qj7j8op0l.codesandbox.io";
    // const imageId = `wadouri:${codeSandboxProjectUrl}/overlay_dicom.dcm`;
    // const imageId ='wadouri:/static/img/github/oh_h-ovly_p01.dcm';
    const imageId ='wadouri:/static/img/mz/s/1-1.dcm';
    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(this.canvas, image);
      const overlayMeta = cornerstone.metaData.get(
        "overlayPlaneModule",
        imageId
      );
      console.log(overlayMeta);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
