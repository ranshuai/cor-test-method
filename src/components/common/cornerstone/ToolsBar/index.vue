<template>
  <div class="dwv-pointer sidepanel from-left">
    <div
      v-for="(value, index) in toolsbars"
      :key="index"
      @click="clickToolsbar(value, index)"
    >
      <div class="pointer-list">
        <!-- <img :src="value.imgSrc" alt /> -->
        <span>{{ value.text }}</span>
      </div>
      <ul
        v-if="value.selsected && (index == 0 || index == 1)"
        class="button_nav_ul _sequence_style _sequence_style_block"
      >
        <li
          v-for="(v, i) in value.childList"
          :key="i"
          @click.stop="resetViewPortLayout(v, i, index)"
        >
          <div :class="v.selsected ? 'ac' + v.text : v.text"></div>
        </li>
      </ul>
      <ul
        class="button_nav_ul _sequence_style"
        v-if="value.selsected && (index != 0 && index != 1  )"
      >
        <li
          v-for="(v, i) in value.childList"
          :key="i"
          @click.stop="secondSoolsbarClick(v, i, index)"
          :class="v.selsected ? 'acText' : ''"
        >
          {{ v.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      toolsbars: [
        {
          text: "检查布局",
          selsected: false, //是否选中
          imgSrc: require("@/assets/images/xl.png"),
          childList: [
            {
              selsected: true,
              text: "one",
              row: "1,100%",
              columns: "1,100%",
              ViewprtNum: 1,
            },
            {
              selsected: false,
              text: "two",
              row: "2,50%",
              columns: "1,100%",
              ViewprtNum: 2,
            },
            {
              selsected: false,
              text: "three",
              row: "1,100%",
              columns: "2,50%",
              ViewprtNum: 2,
            },
            {
              selsected: false,
              text: "fore",
              row: "2,50%",
              columns: "2,50%",
              ViewprtNum: 4,
            },
            {
              selsected: false,
              text: "five",
              row: "2,50%",
              columns: "3,33.33%",
              ViewprtNum: 6,
            },
            {
              selsected: false,
              text: "six",
              row: "3,33.33%",
              columns: "2,50%",
              ViewprtNum: 6,
            },
          ],
        },
        {
          text: "序列布局",
          imgSrc: require("@/assets/images/xl.png"),
          selsected: false, //是否选中
          childList: [
            {
              selsected: true,
              text: "one",
              row: "1,100%",
              columns: "1,100%",
              ViewprtNum: 1,
              type: "sub",
            },
            {
              selsected: false,
              text: "two",
              row: "2,50%",
              columns: "1,100%",
              ViewprtNum: 2,
              type: "sub",
            },
            {
              selsected: false,
              text: "three",
              row: "1,100%",
              columns: "2,50%",
              ViewprtNum: 2,
              type: "sub",
            },
            {
              selsected: false,
              text: "fore",
              row: "2,50%",
              columns: "2,50%",
              ViewprtNum: 4,
              type: "sub",
            },
            {
              selsected: false,
              text: "five",
              row: "2,50%",
              columns: "3,33.33%",
              ViewprtNum: 6,
              type: "sub",
            },
            {
              selsected: false,
              text: "six",
              row: "3,33.33%",
              columns: "2,50%",
              ViewprtNum: 6,
              type: "sub",
            },
          ],
        },
        {
          selsected: false, //是否选中
          text: "调窗",
          imgSrc: require("@/assets/images/tc.png"),
          childList: [
            {
              tool: "Wwwc",
              text: "默认",
              selsected: false,
            },
            {
              tool: "Wwwc",
              selsected: false,
              text: "头部平扫",
              value: {
                center: 35,
                width: 90,
              },
            },
            {
              tool: "Wwwc",
              text: "头颅骨窗",
              selsected: false,
              value: {
                center: 4000,
                width: 700,
              },
            },

            {
              tool: "Wwwc",
              text: "颈椎",
              selsected: false,
              value: {
                center: 1000,
                width: -600,
              },
            },
            {
              tool: "Wwwc",
              text: "肺窗",
              selsected: false,
              value: {
                center: 1000,
                width: -600,
              },
            },
            {
              tool: "Wwwc",
              text: "纵膈窗",
              selsected: false,
              value: {
                center: 350,
                width: 40,
              },
            },
            {
              tool: "Wwwc",
              text: "腹部",
              selsected: false,
              value: {
                center: 1500,
                width: -700,
              },
            },
            {
              tool: "Wwwc",
              text: "关节骨窗",
              selsected: false,
              value: {
                center: 1600,
                width: 550,
              },
            },
            {
              tool: "Wwwc",
              text: "血管",
              selsected: false,
              value: {
                center: 500,
                width: 40,
              },
            },
          ],
        },
        {
          selsected: false, //是否选中
          text: "测量",
          imgSrc: require("@/assets/images/cl.png"),
          childList: [
            {
              tool: "Length",
              text: "直线",
              selsected: false,
            },
            {
              selsected: false,
              text: "角度",
              tool: "Angle",
            },
            {
              selsected: false,
              text: "矩形",
              tool: "RectangleRoi",
            },
            {
              selsected: false,
              text: "椭圆",
              tool: "EllipticalRoi",
            },
            {
              selsected: false,
              text: "探针",
              tool: "Probe",
            },
            {
              selsected: false,
              text: "放大镜",
              tool: "Magnify",
            },
            {
              selsected: false,
              text: "清除",
              clearAll: true,
              tool: "clear",
            },
          ],
        },
        {
          selsected: false, //是否选中
          text: "工具",
          imgSrc: require("@/assets/images/gj.png"),
          childList: [
            {
              selsected: false,
              text: "反色",
              tool: "invplain",
            },
            {
              selsected: false,
              text: "平移缩放",
              tool: "Pan",
            },
            {
              selsected: false,
              text: "重置",
              tool: "reset",
            },
            {
              selsected: false,
              text: "顺时针旋转",
              tool: "rotateViewport+",
            },
            {
              selsected: false,
              text: "逆时针旋转",
              tool: "rotateViewport-",
            },
            {
              selsected: false,
              text: "左右反转",
              tool: "flipViewportHorizontal",
            },
            {
              selsected: false,
              text: "上下反转",
              tool: "flipViewportVertical",
            },
            {
              selsected: false,
              text: "上一张",
              tool: "previous",
            },
            {
              selsected: false,
              text: "下一张",
              tool: "next",
            },
            {
              selsected: false,
              text: "自定义缩放比例",
              tool: "scaleViewport",
            },
            {
              selsected: false,
              text: "自适应窗口",
              tool: "fitToWindow",
            },

            {
              selsected: false,
              text: "空间定位器",
              tool: "Crosshairs",
            },
            {
              selsected: false,
              text: "定位线",
              tool: "ReferenceLines",
            },
            {
              selsected: false,
              text: "解除定位线",
              tool: "jiechu",
            },
            {
              selsected: false,
              text: "保存图片",
              tool: "saveImage",
            },
            {
              selsected: false,
              text: "播放",
              tool: "playClip",
              play: false,
            },
          ],
        },
        {
          selsected: false, //是否选中
          text: "同步",
          imgSrc: require("@/assets/images/gj.png"),
          childList: [
            {
              selsected: false,
              text: "解除同步",
              tool: "tongbu",
              synchronizerType: "unlink",
            },
            {
              selsected: false,
              text: "同步缩放",
              tool: "tongbu",
              toolsub: "Zoom",
              event: "cornerstoneimagerendered",
              synchronizerType: "panZoomSynchronizer",
            },
            {
              selsected: false,
              text: "同步调窗",
              tool: "tongbu",
              toolsub: "Wwwc",
              event: "cornerstoneimagerendered",
              synchronizerType: "wwwcSynchronizer",
            },
            {
              selsected: false,
              text: "同步翻页",
              tool: "tongbu",
              toolsub: "StackScroll",
              event: "cornerstonetoolsstackscroll",
              synchronizerType: "stackScrollSynchronizer",
            },
          ],
        },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * 点击一级菜单
     * @param {v} 一级菜单对应的数据
     * @param {i} 一级菜单对应的下标
     * @returns {void}
     *
     */
    clickToolsbar(v, i) {
      this.toolsbars.forEach((e) => {
        e.selsected = false;
      });
      v.selsected = true;
    },
    /**
     * 点击二级菜单
     * @param {v} 二级菜单对应的数据
     * @param {i} 二级菜单对应的下标
     * @param {pi} 一级菜单的下标
     * @returns {void}
     *
     */
    secondSoolsbarClick(v, i, pi) {
      this.toolsbars[pi].childList.forEach((e) => {
        e.selsected = false;
      });
      v.selsected = true;
      this.$emit("secondSoolsbarClick", v);
    },
    /**
     * 重置视图布局
     * @param {v} 二级菜单对应的数据
     * @param {i} 二级菜单对应的下标
     * @param {pi} 一级菜单的下标
     * @returns {void}
     *
     */
    resetViewPortLayout(v, i, pi) {
      this.toolsbars[pi].childList.forEach((e) => {
        e.selsected = false;
      });
      v.selsected = true;
      this.$emit("resetViewPortLayout", v);
    },
    setplayClip(b) {
      this.toolsbars[3].childList[
        this.toolsbars[3].childList.length - 1
      ].selsected = b;
    },
    setPlayClipText(b) {
      this.toolsbars[4].childList[
        this.toolsbars[4].childList.length - 1
      ].text = b ? "暂停" : "播放";
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/layout.scss";
// @import "@/views/adaptation/ImageBrowsingCornerstone/css/ImageBrowsingCornerstone.scss";
.dwv-pointer {
  width: pxToRem(150);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding-top: pxToRem(10);

  > div {
    width: 100%;
  }

  .pointer-list {
    height: pxToRem(40);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: pxToRem(15);
    color: #737373;
    letter-spacing: pxToRem(3);
    cursor: pointer;
    img {
      height: pxToRem(26);
      width: pxToRem(26);
      margin-right: pxToRem(10);
    }
  }
}
._sequence_style._sequence_style_block {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-top: 0;
}
._sequence_style {
  font-size: pxToRem(12);
  box-shadow: inset 2px 3px 6px 0px rgba(0, 0, 0, 0.34);
  background-color: #eaeaea;
  border-bottom: pxToRem(1) solid #eaeaea;
  box-sizing: border-box;
  position: relative;
  padding-top: pxToRem(10);

  li {
    padding: pxToRem(10);
    text-align: center;
    cursor: pointer;
  }

  //   &:before {
  //     content: "";
  //     position: absolute;
  //     width: pxToRem(9);
  //     height: pxToRem(14);
  //     background: url("../../../../assets/images/adaptation/ipad768-movie_03.png")
  //       no-repeat center top;
  //     background-color: #ffffff;
  //     top: pxToRem(-7);
  //     left: pxToRem(62);
  //   }
}

._sequence_style._sequence_style_block {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 0;

  li {
    width: 50%;
    padding: 0;

    > div {
      height: pxToRem(56);
    }

    .one {
      background: url("../../../../assets/images/adaptation/6.png") no-repeat
        center;
      background-size: pxToRem(46) pxToRem(36);
    }
    .acone {
      background: url("../../../../assets/images/5-1.png") no-repeat center;
      background-size: pxToRem(46) pxToRem(36);
    }

    .two {
      background: url("../../../../assets/images/adaptation/7.png") no-repeat
        center;
      background-size: pxToRem(46) pxToRem(36);
    }
    .actwo {
      background: url("../../../../assets/images/6-1.png") no-repeat center;
      background-size: pxToRem(46) pxToRem(36);
    }

    .three {
      background: url("../../../../assets/images/adaptation/8.png") no-repeat
        center;
      background-size: pxToRem(46) pxToRem(36);
    }
    .acthree {
      background: url("../../../../assets/images/7-1.png") no-repeat center;
      background-size: pxToRem(46) pxToRem(36);
    }

    .fore {
      background: url("../../../../assets/images/adaptation/9.png") no-repeat
        center;
      background-size: pxToRem(46) pxToRem(36);
    }
    .acfore {
      background: url("../../../../assets/images/8-1.png") no-repeat center;
      background-size: pxToRem(46) pxToRem(36);
    }

    .five {
      background: url("../../../../assets/images/adaptation/10.png") no-repeat
        center;
      background-size: pxToRem(46) pxToRem(36);
    }
    .acfive {
      background: url("../../../../assets/images/9-1.png") no-repeat center;
      background-size: pxToRem(46) pxToRem(36);
    }

    .six {
      background: url("../../../../assets/images/adaptation/11.png") no-repeat
        center;
      background-size: pxToRem(46) pxToRem(36);
    }
    .acsix {
      background: url("../../../../assets/images/10-1.png") no-repeat center;
      background-size: pxToRem(46) pxToRem(36);
    }
  }
}
.acText {
  color: #dfa432;
}
</style>