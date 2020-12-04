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
import * as cornerstoneWADOImageLoader from "../../static/codecs/cornerstoneWADOImageLoader.js";
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
    return {
      imageIds: [
        "wadouri:/static/img/blc/1.3.12.2.1107.5.4.4.2463.30000019032904083450000006481.dcm",
        // "wadouri:/static/img/dz/1.3.12.2.1107.5.4.5.111153.30000020111704321136300001489.512.dcm",
      ],
    };
  },
  created() {
    cornerstoneTools.init({
      globalToolSyncEnabled: true,
    });
    const StackScrollTool = cornerstoneTools.StackScrollTool;
    const OverlayTool = cornerstoneTools.OverlayTool;
    cornerstoneTools.addTool(StackScrollTool);
    cornerstoneTools.addTool(OverlayTool);
    cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 1 });
    cornerstoneTools.setToolEnabled("Overlay", {});
  },
  mounted() {
    let imageIds = this.imageIds;
    //define the stack
    const stack = {
      currentImageIdIndex: 0,
      imageIds,
    };
    // Enable Canvas
    this.canvas = this.$refs.canvas;
    cornerstone.enable(this.canvas, {
      renderer: "webgl",
    });
    cornerstone.events.addEventListener(
      "cornerstoneimageloadprogress",
      function (e) {
        const eventData = e.detail;
        // this.setState({ progress: eventData.percentComplete })
        console.log("eventData=>cornerstoneI", eventData);
      }
    );
    // cornerstone.enable(this.canvas);
    // Load Image
    const codeSandboxProjectUrl = "https://1qj7j8op0l.codesandbox.io";
    // const imageId = `wadouri:${codeSandboxProjectUrl}/overlay_dicom.dcm`;
    // const imageId ='wadouri:/static/img/github/oh_h-ovly_p01.dcm';
    // const imageId ='wadouri:/static/img/mz/s/1.dcm';
    const imageId = "wadouri:/static/lc/lcs.dcm";
    // const imageId ='wadouri:/static/img/lc/lcs.dcm';
    cornerstone.loadImage(this.imageIds[0]).then((image) => {
      cornerstone.displayImage(this.canvas, image);
      cornerstoneTools.addStackStateManager(this.canvas, ["stack"]);
      cornerstoneTools.addToolState(this.canvas, "stack", stack);
      //const overlayMeta = cornerstone.metaData.get(
      //"overlayPlaneModule",
      //imageId
      //);
      //console.log(overlayMeta);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
