<template>
  <div @click="selfDwvsItemAcFn(viewportIndex)">
    <div
      ref="viewportDropTarget"
      class="viewport-drop-target viewport-element"
      :class="{ active: activeViewportIndex === viewportIndex }"
    ></div>
  </div>
</template>

<script>
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
    return {};
  },
  watch: {
    // viewportContainerList(val) {
    //   this.viewportInit();
    // },
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
      if (!this.viewportContainerList) {
        return;
      }
      let { image, imageIds, metaData } = this.viewportContainerList;

      this.metaData = Object.assign(this.metaData, metaData);
      /***
       *  先清除 cornerstone.disable(element);
       *  在 cornerstone.enable(element)
       */
      var element = this.$refs.viewportDropTarget;
      cornerstone.disable(element);
      cornerstone.enable(element);
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
      //   var viewport = cornerstone.getDefaultViewportForImage(element, image);

      //   cornerstone.displayImage(element, image, viewport);
      cornerstone.displayImage(element, image);
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
    // this.viewportInit();
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