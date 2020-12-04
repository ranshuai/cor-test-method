<template>
  <div class="tools_bar_content">
    <div class="tools_bar_image">
      <div
        class="item_warpper"
        :title="item.title"
        v-for="(item, i) in toolsList"
        :key="i"
        :class="{ ac: item.selsected }"
      >
        <div class="item" @click="ToolsBarClick(item)">
          <img :src="item.src" alt="" />
        </div>
        <ul class="item_children" v-if="item.children.length > 0">
          <!-- 如果是布局样式 -->
          <div v-if="item.flag == 'layout'" class="layout_warpper">
            <!-- 循环 children  -->
            <div v-for="(_item, _i) in item.children" :key="_i">
              <div>
                <div class="font_12 font_center">{{ _item.title }}</div>
                <table>
                  <tbody>
                    <!-- 循环 row  -->
                    <tr v-for="(__item, __i) in _item.specs.row" :key="__i">
                      <!-- 循环 column  -->
                      <td
                        :class="[
                          '_td',
                          {
                            hover: setClass(
                              { row: __i, col: ___i, className: 'hover' },
                              __i,
                              _item.type
                            ),
                          },
                        ]"
                        v-for="(___item, ___i) in _item.specs.col"
                        :key="___i"
                        :data-cell="JSON.stringify({ row: __i, col: ___i })"
                        @click="
                          cellClick({ row: __i, col: ___i, type: _item.type })
                        "
                        @mouseenter="highlightCells($event, _item.type)"
                        @mouseleave="
                          highlightCells($event, _item.type, {
                            row: -1,
                            column: -1,
                          })
                        "
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-if="item.flag != 'layout'">
            <li
              v-for="(item, j) in item.children"
              :key="j"
              @click="ToolsBarClick(item)"
              :class="{ ac: item.selsected }"
            >
              <span>
                {{ item.title }}
              </span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  components: {},
  props: {
    clickEventInspectTable: {
      type: Function,
    },
    clickEventOrderTable: {
      type: Function,
    },
    clickEventToolsBar: {
      type: Function,
    },
  },
  data() {
    return {
      inspectTable: [], //序列
      orderTable: [], //检查
      activeToolsBar: {}, //激活的功能
      toolsList: [
        {
          eventHandle: false, //是否是功能键
          icon: "",
          title: "布局",
          src: require("../../../../assets/images/layout.png"),
          flag: "layout",
          children: [
            {
              title: "序列布局",
              specs: { row: 6, col: 6 },
              type: "inspectTable",
            },
            {
              title: "图像布局",
              specs: { row: 6, col: 6 },
              type: "orderTable",
            },
          ],
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/play.png"),
          selsected: false,
          title: "播放",
          tool: "playClip",
          play: false,
          children: [],
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/invert.png"),
          title: "反色",
          children: [],
          selsected: false,
          tool: "invplain",
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          title: "调窗",
          tool: "Wwwc",
          selsected: false,
          src: require("../../../../assets/images/wwcc.png"),
          children: [
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              title: "默认",
              parentTitle: "调窗",
              selsected: false,
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              selsected: false,
              title: "头部平扫",
              value: {
                center: 35,
                width: 90,
              },
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "头颅骨窗",
              selsected: false,
              value: {
                center: 4000,
                width: 700,
              },
            },

            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "颈椎",
              selsected: false,
              value: {
                center: 1000,
                width: -600,
              },
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "肺窗",
              selsected: false,
              value: {
                center: 1000,
                width: -600,
              },
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "纵膈窗",
              selsected: false,
              value: {
                center: 350,
                width: 40,
              },
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "腹部",
              selsected: false,
              value: {
                center: 1500,
                width: -700,
              },
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "关节骨窗",
              selsected: false,
              value: {
                center: 1600,
                width: 550,
              },
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "Wwwc",
              parentTitle: "调窗",
              title: "血管",
              selsected: false,
              value: {
                center: 500,
                width: 40,
              },
            },
          ],
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/scroll.png"),
          title: "翻页",
          children: [],
          selsected: true,
          tool: "StackScroll",
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/reversal.png"),
          children: [],
          selsected: false,
          title: "水平反转",
          tool: "flipViewportHorizontal",
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/vertical.png"),
          title: "垂直反转",
          children: [],
          tool: "flipViewportVertical",
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/Rotation.png"),
          children: [],
          selsected: false,
          title: "顺时针旋转",
          tool: "rotateViewport+",
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/Rotation2.png"),
          children: [],
          selsected: false,
          title: "逆时针旋转",
          tool: "rotateViewport-",
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/reset.png"),
          title: "重置",
          children: [],
          selsected: false,
          tool: "reset",
        },
        {
          eventHandle: false,
          icon: "",
          src: require("../../../../assets/images/view.png"),
          title: "显示图层",
          children: [
            {
              eventHandle: true,
              styleHandle: false,
              selsected: true,
              parentTitle: "显示图层",
              title: "显示比例尺",
              tool: "showHideScaleOverlay",
            },
            {
              eventHandle: true,
              styleHandle: false,
              selsected: true,
              parentTitle: "显示图层",
              title: "显示四角标注",
              tool: "showHideTag",
            },
          ],
          selsected: false,
          tool: "showView",
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/big.png"),
          children: [],
          selsected: false,
          title: "放大镜",
          tool: "Magnify",
        },

        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/move.png"),
          title: "平移缩放",
          children: [],
          selsected: false,
          tool: "Pan",
        },
        {
          eventHandle: false,
          icon: "",
          src: require("../../../../assets/images/synchronization.png"),
          title: "同步",
          selsected: false,
          children: [
            {
              eventHandle: true,
              selsected: false,
              styleHandle: true,
              title: "解除同步",
              tool: "tongbu",
              parentTitle: "同步",
              synchronizerType: "unlink",
            },
            // {
            //   selsected: false,
            //   title: "同步平移缩放",
            //   tool: "tongbu",
            //   parentTitle:'同步',
            //   toolsub: "Pan",
            //   event: "cornerstoneimagerendered",
            //   synchronizerType: "panZoomSynchronizer",
            // },
            // {
            //   selsected: false,
            //   title: "同步调窗",
            //   tool: "tongbu",
            //   parentTitle:'同步',
            //   toolsub: "Wwwc",
            //   event: "cornerstoneimagerendered",
            //   synchronizerType: "wwwcSynchronizer",
            // },
            {
              eventHandle: true,
              selsected: false,
              styleHandle: true,
              title: "同步翻页",
              tool: "tongbu",
              parentTitle: "同步",
              toolsub: "StackScroll",
              event: "cornerstonetoolsstackscroll",
              synchronizerType: "stackScrollSynchronizer",
            },
          ],
        },
        {
          eventHandle: false,
          icon: "",
          src: require("../../../../assets/images/line.png"),
          title: "定位线",
          children: [
            {
              eventHandle: true,
              selsected: false,
              title: "解除定位线",
              tool: "ReferenceLines",
              parentTitle: "定位线",
              synchronizerType: "unlink",
            },
            {
              eventHandle: true,
              styleHandle: true,
              tool: "ReferenceLines",
              title: "激活定位线",
              parentTitle: "定位线",
              selsected: false,
            },
          ],
          selsected: false,
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/crosshairs.png"),
          title: "空间定位器",
          children: [
            // {
            //   selsected: false,
            //   title: "解除定位线",
            //   tool: "jiechu",
            // },
          ],
          selsected: false,
          tool: "Crosshairs",
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/Angle.png"),
          title: "角度测量",
          children: [],
          selsected: false,
          tool: "Angle",
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/Probe.png"),
          selsected: false,
          title: "探针",
          children: [],
          tool: "DragProbe",
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/CenterLine.png"),
          tool: "Length",
          title: "直尺测量",
          children: [],
          selsected: false,
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/ellipse.png"),
          selsected: false,
          title: "圆形测量",
          children: [],
          tool: "EllipticalRoi",
        },
        {
          eventHandle: true,
          styleHandle: true,
          icon: "",
          src: require("../../../../assets/images/rectangle.png"),
          selsected: false,
          title: "矩形测量",
          children: [],
          tool: "RectangleRoi",
        },
        {
          eventHandle: true,

          icon: "",
          src: require("../../../../assets/images/clear.png"),
          selsected: false,
          title: "清除",
          clearAll: true,
          children: [],
          tool: "clear",
        },
        {
          eventHandle: true,
          icon: "",
          src: require("../../../../assets/images/save.png"),
          title: "下载图片",
          tool: "saveImage",
          selsected: false,
          children: [],
        },
        // {
        //   icon: "",
        //   src: require("../../../../assets/images/save.png"),
        //   title: "保存",
        //   children: [
        //     {
        //       selsected: false,
        //       title: "下载图片",
        //       type: "",
        //       tool: "saveImage",
        //     },
        //     // {
        //     //   selsected: false,
        //     //   title: "下载dcm文件",
        //     //   type: "dcm",
        //     //   tool: "saveImage",
        //     // },
        //   ],
        // },
      ],
    };
  },
  watch: {},
  computed: {},
  methods: {
    //++++++++++++++++++++布局++++++++++++++++++++++++++++++
    setClass(obj, index, type) {
      let row = this[type][index];
      if (this[type].length <= 0) {
        return;
      }
      return _.some(row, obj);
    },
    jisuanNum(txt) {
      let _tt = 100 / Number(txt);
      _tt = parseInt(_tt * 100);
      _tt = _tt / 100;
      return _tt;
    },
    cellClick(obj) {
      //let data = {row: Number(obj.row + 1) + "," + (100 / Number(obj.row + 1)).toFixed(2) + "%", columns: Number(obj.col + 1) + "," + (100 / Number(obj.col + 1)).toFixed(2) + "%", ViewprtNum: Number(obj.row + 1) * Number(obj.col + 1),};
      let data = {
        ViewprtNum: Number(obj.row + 1) * Number(obj.col + 1),
        style:
          "width:" +
          this.jisuanNum(obj.col + 1) +
          "%;height:" +
          this.jisuanNum(obj.row + 1) +
          "%",
      };
      //如果是检查布局
      if (obj.type == "inspectTable") {
        this.$emit("clickEventInspectTable", data, obj.type);
      } else {
        this.$emit("clickEventOrderTable", data, obj.type);
      }
    },
    highlightCells(ev, type, mouseleave) {
      /**
       *   鼠标移入的时候
       *   会生成一个table的row的数据集合
       *    [{className: "hover",col: 0,row: 0}]
       *    如果行和列都能匹配，就被classname赋给当前的元素
       *
       */

      let element = ev.target;
      let currentCell = JSON.parse(element.getAttribute("data-cell"));
      if (mouseleave) {
        currentCell = mouseleave;
      }
      function isRange(cell, parentCell) {
        return cell.row <= parentCell.row && cell.col <= parentCell.col;
      }
      let table = [];
      for (let row = 0; row < 6; row++) {
        let newRow = [];
        for (let col = 0; col < 6; col++) {
          let cell = { row: row, col: col };
          if (isRange(cell, currentCell)) {
            cell.className = "hover";
          } else {
            cell.className = "selectedBefore";
          }
          newRow.push(cell);
        }
        table.push(newRow);
      }
      this[type] = table;
    },
    //++++++++++++++++++++布局++++++++++++++++++++++++++++++
    //++++++++++++++++++++tools++++++++++++++++++++++++++++++
    ToolsBarClick(v) {
      //如果不是功能按钮
      if (!v.eventHandle) {
        return;
      }

      //不需要设置样式
      if (!v.styleHandle) {
        if (v.parentTitle == "显示图层") {
          v.selsected = !v.selsected;
        }
      } else {
        /**
         * 1.清空状态
         * 2.添加状态
         */
        this.toolsList.forEach((item) => {
          //如果当前的工具菜单的事件和其它的菜单事件有冲突，就清空其它的事件
          item.selsected = false;
          if (item.children.length > 0) {
            item.children.forEach((ele) => {
              if (
                ["showHideScaleOverlay", "showHideTag"].indexOf(ele.tool) == -1
              ) {
                ele.selsected = false;
              }
            });
          }
        });

        //如果点击的是预设调窗
        if (v.parentTitle == "调窗") {
          this.toolsList[3].selsected = true;
        } else if (v.parentTitle == "同步") {
          //如果点击的是同步
          this.toolsList[13].selsected = true;
        } else if (v.styleHandle) {
          v.selsected = true;
        }
      }

      this.setActiveToolsBar(v);
      this.$emit("clickEventToolsBar");
    },
    //++++++++++++++++++++tools++++++++++++++++++++++++++++++
    setActiveToolsBar(activeToolsBar) {
      this.activeToolsBar = activeToolsBar;
    },
    getActiveToolsBar() {
      return this.activeToolsBar;
    },
    getToolsList() {
      return this.toolsList;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scope>
.ac {
  background: #84ccc9;
}
.tools_bar_content {
  height: 0.45rem;
  background: #b5b5b5;
  // background:var(--default-background)
  .item_warpper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0.45rem;
    position: relative;
  }
  .item_warpper:hover {
    background: #84ccc9;
  }
  .item_warpper:hover .item_children {
    display: block;
  }
  .tools_bar_image {
    display: flex;
    align-items: center;
    height: 100%;
    .item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      img {
        width: 0.28rem;
        height: 0.28rem;
        // width: 100%;
        // height: 100%;
      }
    }
  }
  .item_children {
    position: absolute;
    left: 0rem;
    top: 0.45rem;
    background: #e5e5e5;
    width: 1.6rem;
    font-size: 0.14rem;
    display: none;
    // padding-top: 0.12rem;
    cursor: pointer;
    z-index: 10;

    li {
      padding: 0.06rem;
    }
    li:hover {
      background: #84ccc9;
    }
  }

  .layout_warpper {
    padding: 4px;
    table {
      margin: 0 auto;
      border-spacing: 0;
      border-collapse: collapse;
    }
    ._td {
      width: 20px;
      height: 20px;
      border: 1px solid black;
      cursor: pointer;
    }

    ._td:hover {
      background-color: #84ccc9;
    }

    ._td.hover {
      background-color: #84ccc9;
    }
  }
}
</style>
