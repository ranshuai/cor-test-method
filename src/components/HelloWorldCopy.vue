<template>
  <main style="display: flex;">
      <button @click="clearStore">
          清除缓存
      </button>
    <div ref="canvas" style="width: 80%; height: 500px"></div>
    <!-- thumbnail 缩略图 S-->
    <ThumbnailWrapperComponents
      :studies-date="patientSeriesList"
      @thumbnailClick="thumbnailClick"
      @setSeriesStore="setSeriesStore"
    ></ThumbnailWrapperComponents>
    <!-- thumbnail 缩略图 E-->
  </main>
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

import ThumbnailWrapperComponents from "@/components/common/cornerstone/ThumbnailWrapperComponents.vue";

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
  //   cornerstoneWADOImageLoader.initialized = true;
}
export default {
  components: {
    ThumbnailWrapperComponents,
  },
  name: "HelloWorld",
  data() {
    return {
      patientSeriesList: [
        {
          getDcmFilePath: [
            "wadouri:/static/img/blc/1.3.12.2.1107.5.4.4.2463.30000019032904083450000006481.dcm",
          ],
        },
        {
          getDcmFilePath: [
            "wadouri:/static/img/blc/1.3.12.2.1107.5.4.4.2463.30000019032904083450000006485.dcm",
          ],
        },
        {
          getDcmFilePath: [
            "wadouri:/static/img/blc/1.3.12.2.1107.5.4.4.2463.30000019032904083450000006487.dcm",
          ],
        },
        {
          getDcmFilePath: [
            "wadouri:/static/img/blc/1.3.12.2.1107.5.4.4.2463.30000019032904083450000006489.dcm",
          ],
        },
      ],
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
  methods: {
    thumbnailClick() {},
    setSeriesStore() {},
    clearStore(){
        window.location.reload();
        // window.open('http://localhost:8083/#/','newwindow');
        // window.open ('http://localhost:8083/#/', 'newwindow', 'height=100, width=400, top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no')
        // window.location.href = 'http://localhost:8083/#/';
        return
        console.log('cornerstone',cornerstone);
        console.log('cornerstoneWADOImageLoader',cornerstoneWADOImageLoader);
        console.log('cornerstoneWADOImageLoader=>getInfo',cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.getInfo());
        console.log('cornerstone=>getCacheInfo',cornerstone.imageCache.getCacheInfo());
        cornerstone.imageCache.purgeCache()
         console.log('cornerstone=>getCacheInfo',cornerstone.imageCache.getCacheInfo());

        
    }
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
        // console.log("eventData=>cornerstoneI", eventData);
      }
    );
    // cornerstone.enable(this.canvas);
    // Load Image
    cornerstone.loadAndCacheImage(this.patientSeriesList[0].getDcmFilePath[0]).then((image) => {
      cornerstone.displayImage(this.canvas, image);
      cornerstoneTools.addStackStateManager(this.canvas, ["stack"]);
      cornerstoneTools.addToolState(this.canvas, "stack", stack);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
