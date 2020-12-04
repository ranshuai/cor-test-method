<template>
  <div class="back">
      <span @click="back">
        <img src="../../../../assets/images/adaptation/fh.png" alt="返回">
      </span>
  </div>
</template>
<style lang="scss">
.back {
  color: red;
  width: pxToRem(69);
  height: pxToRem(55);
  line-height: 0;
  text-decoration: none;
  position: absolute;
  top: 0rem;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    width: pxToRem(31);
    height: pxToRem(25);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.back(-1);
    }
  },
  created() {},
  mounted() {}
};
</script>