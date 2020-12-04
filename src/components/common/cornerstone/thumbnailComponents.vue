<template>
  <div class="_pr _thumbnail">
    <div class="image-thumbnail" :class="{'ac':activeSeriesIndex == id}">
      <canvas v-show="!loadingGifShow" ref="canvasRef" />
      <img v-show="loadingGifShow" :src="loadingGif" />
    </div>
    <span class="_pa flag_num">{{ imageIds.length }}</span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    imageIds: {
      type: Array,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    activeSeriesIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loadingGifShow: false,
      loadingGif: require("@/assets/images/loading.gif"),
    };
  },
  watch: {},
  computed: {},
  methods: {
    thumbnailInit() {
      this.loadingGifShow = true;
    },
    thumbnailRenderToCanvas(canvasRef, image) {
      if (!canvasRef || !image) {
        return;
      }
      this.loadingGifShow = false;

      cornerstone.renderToCanvas(canvasRef, image);
    },
  },
  created() {},
  mounted() {
    //初始化显示默认图片
    this.thumbnailInit();
    //显示序略图
    cornerstone.loadAndCacheImage(this.imageIds[0]).then((image) => {
      this.thumbnailRenderToCanvas(this.$refs.canvasRef, image);
      this.$emit("setSeriesStore", image, this.id + 1);
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/layout.scss";
._thumbnail {
  margin-bottom: pxToRem(10);
}
</style>   