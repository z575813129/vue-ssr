<template>
  <div id="main">

    <div class="px">
      <div class="md-title mbm">
        About BAAC:
      </div>

      &nbsp;&nbsp;&nbsp;I'll be in your neighborhood doing errands this week. Do you want to meet?
    </div>


  </div>
</template>

<script>
  export default {
    name: "about",
    meta: {
      requireAuth: false
    },
    layout: 'vuetify',
    data() {
      return {
        height: ''
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  #main {
    height: 100%;
    width: 100%;
  }
</style>
