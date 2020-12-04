<template>
  <div class="sidepanel from-right" style="background: #b5b5b5;">
    <div
      class="_pr thumbnail"
      ref="tcSfPath"
      v-for="(item, index) in studiesDate"
      :key="index"
      @click="thumbnailClick(item.getSmallFilePath, index)"
    >
      <!-- thumbnail Item S-->
      <ThumbnailComponents
        :image-ids="item.getDcmFilePath"
        :id="index"
        :active-series-index="ActiveSeriesIndex"
        @setSeriesStore="OnsetSeriesStore"
      ></ThumbnailComponents>
      <!-- thumbnail Item E-->
    </div>
  </div>
</template>

<script>
import ThumbnailComponents from "./thumbnailComponents";

export default {
  components: {
    ThumbnailComponents,
  },
  props: {
    studiesDate: {
      type: Array,
    },
    onThumbnailClick: {
      type: Function,
    },
    setSeriesStore: {
      type: Function,
    },
  },
  data() {
    return {
      ActiveSeriesIndex: 0,
    };
  },
  watch: {},
  computed: {},
  methods: {
    thumbnailClick(key, index) {
      this.ActiveSeriesIndex = index;
      this.$emit("thumbnailClick", key, index);
    },
    OnsetSeriesStore(image, key) {
      this.$emit("setSeriesStore", image, key);
    },
  },
  created() {},
  mounted() {
    // console.log(this);
  },
};
</script>