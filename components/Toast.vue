<style lang="scss" scoped>
  .main {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999999;
    /*img {*/
    /*width: 50%;*/
    /*border-radius: 50%;*/
    /*margin: auto;*/
    /*}*/
    p {
      color: #fff;
      background: rgba(0, 0, 0, 0.74);
      max-width: 200px;
      border-radius: 3px;
      margin: 0 auto;
    }
  }

  /*.success {*/
  /*background: #1afa29;*/
  /*}*/

  /*.fail {*/
  /*background: #d81e06;*/
  /*}*/

  /*.warning {*/
  /*background: #f4ea2a;*/
  /*}*/
</style>

<template>
  <transition name="fade" class="toast-large">
    <div class="main flex" v-if="toast.show"
         :class="{success:toast.type==='success',
         fail: toast.type==='cancel',warning:toast.type==='warning'}">
      <!--<img src="../assets/icons/success.png" alt="" class="bg-w" v-if="toast.type==='success'">-->
      <!--<img src="../assets/icons/fail.png" alt="" class="bg-w" v-if="toast.type==='cancel'">-->
      <!--<img src="../assets/icons/warning.png" alt="" class="bg-w" v-if="toast.type==='warning'">-->
      <p class="tc p">{{toast.content}}</p>
    </div>
  </transition>
</template>

<script>

  export default {
    computed: {
      toast() {
        return this.$store.state.toast
      }
    }
  }
</script>
