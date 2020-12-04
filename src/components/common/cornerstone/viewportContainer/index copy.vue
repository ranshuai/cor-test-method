<template>
  <div @click="selfDwvsItemAcFn(viewportIndex)">
    <div
      ref="viewportDropTarget"
      class="viewport-drop-target viewport-element"
      :class="{ active: activeViewportIndex === viewportIndex }"
    ></div>
    <div class="ViewportOverlay" v-if="metaData.PatientName">
      <div class="top-left overlay-element">
        <div>
          {{ metaData.PatientName }}
        </div>
        <div>
          {{ metaData.PatientID }}
        </div>
      </div>
      <div class="top-right overlay-element">
        <div>{{ metaData.StudyDescription }}</div>
        <div>{{ metaData.StudyDate }}-{{ metaData.StudyTime }}</div>
      </div>
      <div class="bottom-right overlay-element">
        <div>Zoom: {{ metaData.zoomPercentage }}</div>
        <div>{{ metaData.WWCC }}</div>
        <div class="compressionIndicator">
          Lossless / Uncompressed
        </div>
      </div>
      <div class="bottom-left overlay-element">
        <div>Ser:{{ metaData.seriesNumber }}</div>
        <div></div>
        <div>
          <div>512 x 512</div>
          <div>Loc: -282.50 mm</div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
cornerstoneTools.init({
  globalToolSyncEnabled: true
});
export default {
  components: {},
  props: {
    activeViewportIndex: {
      type: Number
    },
    viewportContainerList: {
      type: Object
    },
    viewportIndex: {
      type: Number
    },
    seriesIndex: {
      type: Number
    }
  },
  data() {
    return {
      metaData: {
        zoomPercentage: "",
        WWCC: "",
        PatientName: "",
        PatientID: "",
        StudyDescription: "",
        StudyDate: "",
        StudyTime: ""
      }
    };
  },
  watch: {
    viewportContainerList(val) {
      this.viewportInit();
    },
    activeViewportIndex() {
      //   this.viewportInit();
    }
    // seriesIndex() {
    //   this.viewportInit();
    // }
  },
  computed: {},
  methods: {
    onImageRendered(e) {
      const viewport = cornerstone.getViewport(e.target);
      let { imageIds } = this.viewportContainerList;
      var seriesMetadata =
        cornerstone.metaData.get("generalSeriesModule", imageIds[0]) || {};
      //   console.log(seriesMetadata);

      this.metaData.seriesNumber = seriesMetadata.seriesNumber;
      this.metaData.zoomPercentage = `${Math.round(
        viewport.scale.toFixed(2) * 100
      )}%`;
      this.metaData.WWCC = `W:${Math.round(
        viewport.voi.windowWidth
      )}/L:${Math.round(viewport.voi.windowCenter)}`;
    },
    viewportInit() {
      /***
       *  先清除 cornerstone.disable(element);
       *  在 cornerstone.enable(element)
       *
       *
       */

      //   console.log(this.viewportContainerList);
      var element = this.$refs.viewportDropTarget;
      cornerstone.disable(element);
      if (this.viewportContainerList) {
        let { image, imageIds, metaData } = this.viewportContainerList;
        this.metaData = Object.assign(this.metaData, metaData);

        element.addEventListener(
          "cornerstoneimagerendered",
          this.onImageRendered
        );
        //
        // debugger;

        // console.log("getEnabledElements", cornerstone.getEnabledElements());
        // let enabledElements = cornerstone.getEnabledElements();
        // for (var i = 0; i < enabledElements.length; i++) {
        //   if (enabledElements[i].element === element) {
        //   } else {
        //     cornerstone.enable(element);
        //   }
        // }
        // if (enabledElements.length == 0) {
        //   cornerstone.enable(element);
        // }
        cornerstone.enable(element);

        //添加工具
        // cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
        // cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
        // 默认右键是翻页
        //激活工具
        cornerstoneTools.setToolActive("StackScrollMouseWheel", {
          mouseButtonMask: 1
        });
        // 默认是翻页
        cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 1 });
        cornerstoneTools.addStackStateManager(element, ["stack"]);
        cornerstoneTools.addToolState(element, "stack", {
          currentImageIdIndex: 0,
          imageIds: imageIds
        });
        var viewport = cornerstone.getDefaultViewportForImage(element, image);

        cornerstone.displayImage(element, image, viewport);
      } else {
        cornerstone.enable(element);
      }
    },
    viewportDropTargetResize() {
      var enabledElement = this.$refs.viewportDropTarget;
      //节点是否被激活
    //   console.log(cornerstone.getEnabledElements());
      if (1) {
        cornerstone.resize(enabledElement);
      }
    },
    selfDwvsItemAcFn(i) {
      //   console.log(i);
      this.$emit("selfDwvsItemAcFn", i);
    },
    onImageLoaded(e) {
      //console.log('cornerstoneimageloaded: ')
      this.onLoadedImage();
    }
  },
  created() {},
  componentDidMount() {
    cornerstone.events.addEventListener(
      "cornerstoneimageloaded",
      this.onImageLoaded
    );
  },
  updated() {},
  mounted() {
    this.viewportInit();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/layout.scss";
.wrapper {
  height: 100%;
  .box-layout {
    height: calc(100% - 0.55rem - 0.14rem);
    .main-content {
      flex: 1;
      height: 100%;
      overflow: hidden;
      transition: all 0.3s ease;
      width: 100%;
      .viewer-main {
        width: 100%;
        height: 100%;
        .viewprt-grid {
          display: grid;
          grid-template-rows: repeat(1, 100%);
          grid-template-columns: repeat(1, 100%);
          height: 100%;
          width: 100%;
          .viewport-container {
            height: 100%;
            width: 100%;
            position: relative;
            .viewport-element {
              height: 100%;
              width: 100%;
              position: relative;
              box-sizing: border-box;
              border-width: 2px;
              border-style: solid;
              border-color: rgb(119, 119, 119);
            }
            .active {
              box-sizing: border-box;
              border-width: 2px;
              border-style: dashed;
              border-color: rgb(70, 159, 235);
              border-image: initial;
            }
          }
        }
      }
    }
  }
}
.ViewportOverlay {
  color: #9ccef9;
  font-size: 14px;
}
.ViewportOverlay {
  .overlay-element {
    position: absolute;
    font-weight: 400;
    text-shadow: 1px 1px #000;
    pointer-events: none;
  }
  .top-left {
    top: 20px;
    left: 20px;
  }
  .top-right {
    top: 20px;
    right: 20px;
    text-align: right;
  }
  .bottom-left {
    bottom: 20px;
    left: 20px;
  }
  .bottom-right {
    bottom: 20px;
    right: 20px;
    text-align: right;
  }
}
</style>