<template>
  <div style="height: 0.55rem;">
    <div class="pad_child_header" v-if="IS_DEVICE != 'pc'">
      <pad-back v-if="!backHide"></pad-back>
      <span class="_title">{{ title }}{{ filmerNum }}</span>
    </div>
    <div class="pad_child_header_pc" v-if="IS_DEVICE == 'pc'">
      <!-- <span class="_title">{{title}}</span> -->
      <div class="logoImgWarpper">
        <img v-if="logoImgSrc" :src="logoImgSrc" alt class="logoImg" />
      </div>
      <div class="userWarpper" v-if="userInfo && userInfo.loginName">
        <i class="person"></i>
        <span class="username">{{ userInfo.loginName || "" }}</span>
        <div
          id="clickIcon"
          @click="clickicon"
          :class="btndisabled ? 'arrortop' : 'arror'"
        ></div>
        <div class="nonewrap" v-show="ishidden" @click="funcHandle">
          <div>退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.qr {
  position: absolute;
  right: pxToRem(16);
  top: 0;
  color: #fff;
  font-size: 0.18rem;
}
.logoImgWarpper {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: pxToRem(20);
}
.logoImg {
  height: pxToRem(40);
}
.userWarpper {
  height: 100%;
  padding-right: pxToRem(20);
  color: #ffffff;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  .person {
    background: url("../../../../assets/images/per.png") no-repeat;
    width: pxToRem(40);
    height: pxToRem(40);
    background-size: 100% 100%;
    display: inline-block;
    vertical-align: middle;
  }
  .username {
    margin: 0 pxToRem(8);
    color: #ffffff;
    font-size: pxToRem(16);
  }
  .arrortop {
    background: url("../../../../assets/images/arror.png") no-repeat;
    width: pxToRem(15);
    height: pxToRem(15);
    display: inline-block;
    background-size: 100% 100%;
    vertical-align: middle;
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* IE 9 */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg); /* Opera */
    cursor: pointer;
  }
  .arror {
    background: url("../../../../assets/images/arror.png") no-repeat;
    width: pxToRem(15);
    height: pxToRem(13);
    display: inline-block;
    background-size: 100% 100%;
    vertical-align: middle;
    cursor: pointer;
  }
  .nonewrap {
    position: absolute;
    width: 0.8rem;
    background: #439be5;
    text-align: center;
    top: 0.47rem;
    right: 0;
    z-index: 99;
    color: #ffffff;
    border: 1px solid #439be5;
    box-shadow: 0px pxToRem(5) pxToRem(10) #8d8f8e;
    cursor: pointer;
    padding: pxToRem(15) pxToRem(5);
    font-size: 0.16rem;
    .listitem {
      height: 0.4rem;
      line-height: 0.4rem;
    }
  }
}
.pad_child_header_pc {
  height: pxToRem(55);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background: #469feb;
  z-index: 10;
}
.pad_child_header {
  height: pxToRem(55);
  position: fixed;
  left: 0;
  top: 0;
  line-height: pxToRem(56);
  text-align: center;
  width: 100%;
  background: #469feb;
  z-index: 10;
}
.pad_child_header > ._title {
  font-size: pxToRem(14);
  color: #ffffff;
}
</style>


<script>
import { isDeviceSelect } from "../../../../utils/index";
import { HttpService } from "../../../../provides/httpService";
import { imgUrlLoadingCustorm } from "@/utils/img-url-loading-custom";
export default {
  components: {},
  props: ["title", "backHide", "filmerNum"],
  data() {
    return {
      IS_DEVICE: isDeviceSelect(),
      btndisabled: false,
      ishidden: false,
      logoImgSrc: "",
    };
  },
  watch: {},
  computed: {
    userInfo: function () {
      let info = sessionStorage.getItem("userInfo") || "{}";
      return JSON.parse(info);
    },
  },
  methods: {
    clickicon() {
      this.btndisabled = !this.btndisabled;
      if (this.btndisabled) {
        this.ishidden = true;
      } else {
        this.ishidden = false;
      }
    },
    //退出
    funcHandle() {
      HttpService({
        url: "/powerfilmer/logout",
        params: {},
        type: "get",
        headers: {},
      }).then((res) => {
        sessionStorage.clear();
      });
    },
  },
  created() {},
  mounted() {
    let pclogoImgSrc = sessionStorage.getItem("pclogoImgSrc");
    if (pclogoImgSrc) {
      imgUrlLoadingCustorm(pclogoImgSrc).then((res) => {
        this.logoImgSrc = res;
      });
    } else {
      this.logoImgSrc = require("../../../../assets/images/adaptation/logo.png");
    }
  },
};
</script>
