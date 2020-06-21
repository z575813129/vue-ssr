<template>
  <div id="main">
    <loadMore ref="vueLoad" @bottom-method="handleBottom"  @bottom-error-click="handleBottomError" >
      <postCell :item="item" v-for="item in list" :key="item.id" />
    </loadMore>
  </div>
</template>

<script>
  import postCell from '@/components/postCell'
  import LoadMore from '@/components/LoadMore'
  export default {
    name: "myCollections",
    components: {postCell, LoadMore},
    layout: 'vuetify',
    meta: {
      requireAuth: true
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        list: []
      }
    },
    mounted() {
      this.fetchList()
    },
    head() {
      return {
        title: this.$t('my.collections.title')
      }
    },
    methods: {
      fetchList() {
        this.$axios.get(`/api/v2/my/listMyCollectionPost?pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(({data}) => {
          
          this.total = data.total
          // this.list = data.rows
          if (!data.rows || data.rows.length == 0) {
            this.$refs.vueLoad.onBottomLoaded(false)
          } else {
            this.list = this.list.concat(data.rows)
            this.pageNum+=1
            this.$refs.vueLoad.onBottomLoaded(true)
          }
          
        }).catch(console.error)
      },
      handleBottom() {
        console.log('loadmore')
        this.fetchList()
        // loaded('done')
      },
      // 如果是错误状态，点击从新请求数据
      handleBottomError(){
        this.handleBottom()
      }
    }
  }
</script>

<style lang="scss" scoped>
  #main {
    height: 100%;
    width: 100%;
  }
</style>
