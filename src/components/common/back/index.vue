<template>
  <div class="c_back">
      <div class="" @click="back">
        <img src="../../../assets/images/fh.png" alt="">
      </div>
  </div>
</template>
<style lang="scss">
  .back{
    img{
      width:pxToRem(19);
      height: pxToRem(34)
    }
  }
</style>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{
      back(){
          this.$router.back(-1)
      }
  },
  created(){},
  mounted(){}
}
</script>