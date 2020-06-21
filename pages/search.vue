<template>
  <div id="main">
     <loadMore ref="vueLoad" @bottom-method="handleBottom"  @bottom-error-click="handleBottomError" >
      <div class="md-title primary--text">Search: {{this.keywords}}</div>
      <postCell :item="item" v-for="item in list" :key="item.id" />
    </loadMore>

  </div>
</template>

<script>
  import LoadMore from '@/components/LoadMore'
  import postCell from '@/components/postCell'
  export default {
    name: "search",
    layout: 'vuetify',
    components: {LoadMore, postCell},
    key (route) {
      return route.fullPath
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10,
        keywords: '',
        list: [],
        total: 0,
      }
    },
    head () {
      return {
        title: 'BAAC - Search'
      }
    },
    async asyncData(ctx) {
      // const initData = {
      //   pageNum: 1,
      //   pageSize: 10,
      //   keywords: '',
      //   list: [],
      //   total: 0,
      // }
      // const { app, query } = ctx
      // const { keywords, pageNum, pageSize } = query
      // initData.keywords = keywords
      // console.log(keywords)
      // try {
      //   const {data} = await app.$axios.get(`/api/v2/searchPost`, {
      //     params: {
      //       keywords: keywords,
      //       pageNum: initData.pageNum,
      //       pageSize: initData.pageSize
      //     }
      //   })
        
      //   initData.list =data.rows
        
      // } catch (err) {
      //   // console.error(err)
      // }
      // return initData
      // return fetchList()
    },
    mounted() {
      const { keywords } = this.$route.query
      this.keywords = keywords
      this.fetchList()
    },
    // watchQuery: ['keywords'],
    methods: {
      fetchList() {
        return this.$axios.get(`/api/v2/searchPost`, {
          params: {
            keywords: this.keywords,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(({data}) => {
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
  width: 100%;
  height: 100%;
  // overflow: auto;
}
    .md-icon{
      font-size: 20px !important;
    }
    .people {
      width: 100px;
      height: 80px;
    }
    .history-btn {
      background: #fed0c0;
    }

    .hot-btn {
      background: #f8ddd4;
    }
  

</style>
