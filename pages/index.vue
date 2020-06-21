<template>
  <div id="main">
    <loadMore ref="vueLoad" @bottom-method="handleBottom" @top-method="refresh" @bottom-error-click="handleBottomError" >
      <v-carousel id="head"
        cycle
        hide-delimiter-background
        :show-arrows="false"
        height="220px"
      >
        <v-carousel-item
          src="https://cdn.86baac.com/image/random/20200116-0bd708a4-ba1f-4d74-8755-c73596b8a509.jpg"
          lazy-src="https://cdn.86baac.com/image/random/20200116-0bd708a4-ba1f-4d74-8755-c73596b8a509.jpg"
        >
        </v-carousel-item>
        <v-carousel-item
          src="https://cdn.86baac.com/image/random/20200116-4caba8a9-c15b-47c0-9208-63cc31a28390.jpg"
          lazy-src="https://cdn.86baac.com/image/random/20200116-4caba8a9-c15b-47c0-9208-63cc31a28390.jpg"
        >
        </v-carousel-item>
        <v-carousel-item
          src="https://cdn.86baac.com/image/random/20200116-ee7586f7-8bcb-4302-bdcd-e7230b37cd08.jpg"
          lazy-src="https://cdn.86baac.com/image/random/20200116-ee7586f7-8bcb-4302-bdcd-e7230b37cd08.jpg"
        >
        </v-carousel-item>
        <v-carousel-item
          src="https://cdn.86baac.com/image/random/20200116-8ce2b17b-86a5-4f54-85e0-7222ce4c67ee.jpg"
          lazy-src="https://cdn.86baac.com/image/random/20200116-8ce2b17b-86a5-4f54-85e0-7222ce4c67ee.jpg"
        >
        </v-carousel-item>
        <v-carousel-item
          src="https://cdn.86baac.com/image/random/20200116-08f1e783-743d-4b5e-aabb-72c26d8859b5.jpg"
          lazy-src="https://cdn.86baac.com/image/random/20200116-08f1e783-743d-4b5e-aabb-72c26d8859b5.jpg"
        >
        </v-carousel-item>
        <v-carousel-item
          src="https://cdn.86baac.com/image/random/20200116-cb806857-7003-4ddb-a1a9-649f4f1ce763.jpg"
          lazy-src="https://cdn.86baac.com/image/random/20200116-cb806857-7003-4ddb-a1a9-649f4f1ce763.jpg"
        >
        </v-carousel-item>
      </v-carousel>

    <div id="nav" class="d-flex flex-wrap justify-center grey lighten-2" >
      <div class="category"  v-for="(item, index) in categories" :key="index" >
        <nuxt-link :to="`/category?category=${item.code}`">
          <v-avatar size="40" >
            <img :src="item.src"  :alt="$t('common.categories.'+item.code)">
          </v-avatar>
          <p class="color-h" style="margin-bottom:0;" >{{$t('common.categories.'+item.code)}}</p>
        </nuxt-link>
      </div>
    </div>
    <div >
      <v-tabs v-model="tabId" @change="tabChanged" height="36px" >
        <v-tab class="tab">{{$t('category.latest')}}</v-tab>
        <v-tab class="tab">{{$t('category.hot')}}</v-tab>
        <v-tab class="tab">{{$t('category.release')}}</v-tab>
      </v-tabs>
      
        <!-- <div style="width:100%;height:720px;background-color:red;">

        </div> -->
        <!-- <postCell :item="item" v-for="item in list" :key="item.id" /> -->
        <div v-if="tabs[tabId]" >
          <postCell :item="item" v-for="(item, i) in tabs[tabId].list" :key="i" />
        </div>
    </div>
    
    </loadMore>
    <div class="create">
      <v-btn color="primary" fab @click="$router.push('/my/postCreate')" >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
  import postCell from '@/components/postCell'
  import LoadMore from '@/components/LoadMore'
  export default {
    name: 'index',
    components: {postCell, LoadMore},
    layout: 'vuetify',
    meta: {
      requireAuth: false,
      keepAlive: true
    },
    key (route) {
      return route.fullPath
    },
    head() {
      return {
        title: this.title,
        meta: [
          // { hid: 'keywords', name: 'keywords', content: 'BAAC Form Rent Transfer Chinese Trade Visa Enjoy Transport Apply Car Other'}
        ]
      }
    },
    data() {
      return {
        title: 'BAAC',
        tabId: 0,
        tabs: [
          { // 最新
            pageNum: 1,
            pageSize: 10,
            list: [],
            total: 0,
            sort: 'latest'
          },
          {
            pageNum: 1,
            pageSize: 10,
            list: [],
            total: 0,
            sort: 'hot'
          },
          {
            pageNum: 1,
            pageSize: 10,
            list: [],
            total: 0,
            sort: 'release'
          }
        ],
      }
    },
    computed: {
      // sort() {
      //   // return this.$route.query.sort || 'latest'
      //   switch(this.tabId) {
      //     case 1:
      //       return 'hot';
      //     case 2:
      //       return 'release';
      //     default:
      //       return 'latest';
      //   }
      // },
      categories() {
        return this.$store.state.categories
      }
    },
    mounted() {
      //  this.$refs.vueLoad.emitBottomMethod()
    },
    activated() {
      console.log('activated')
      const tab = this.tabs[this.tabId]
      if (tab.pageNum == 1) {
        this.$refs.vueLoad.emitBottomMethod()
      }
    },
    deactivated() {
      console.log('deactivated')
      console.log(this.tabs)
      const tab0 = this.tabs[0]
      tab0.pageNum =1
      tab0.list = []
      tab0.total = 0

      const tab2=this.tabs[2]
      tab2.pageNum =1
      tab2.list = []
      tab2.total = 0
    },
    methods: {
      tabChanged(id) {
        console.log(this.tabId)
        this.$refs.vueLoad.reset()
        const tab = this.tabs[this.tabId]
        if (tab) {
          if (tab.pageNum == 1) {
            this.$refs.vueLoad.emitBottomMethod()
          }
        }
      },
      async fetchList() {
        try {
          const tab = this.tabs[this.tabId]
          if (tab) {
            const res = await this.fetchHomeList(tab)
            this.$refs.vueLoad.onBottomLoaded(res)
          }
          
        } catch (err) {
          this.$refs.vueLoad.onBottomError()
        }
      },
      fetchHomeList(tab) {
        return this.$axios.get(`/api/v2/listPost?sort=${tab.sort}&pageNum=${tab.pageNum}&pageSize=${tab.pageSize}`).then(({data}) => {
          tab.total = data.total
          if (!data.rows || data.rows.length == 0) {
            return false
          } else {
            tab.list = tab.list.concat(data.rows)
            tab.pageNum+=1
            return true
          }
        })
      },
      async refresh() {
        console.log('refresh')
        try {
          const tab = this.tabs[this.tabId]
          
          if (tab) {
            tab.pageNum = 1
            tab.list = []
            tab.total = 0
            const res = await this.fetchHomeList(tab)
            
          }
        } catch (err) {
          
        }
        this.$refs.vueLoad.onTopLoaded()
        // loaded('done')
      },
      handleBottom() {
        console.log('loadmore')
        this.fetchList()
        // loaded('done')
      },
      // 如果是错误状态，点击从新请求数据
      handleBottomError(){
        this.handleBottom()
      },
    }
  }
</script>

<style lang="scss" scoped>
  
  #head {
    // width: 100vw;
  } 
  #nav {
    padding: 10px;
  }

  .category {
    text-align: center;
    width: 20%;
    padding: 5px;
  }
  #main {
    height: 100%;
    // height:150vh;
    // margin-top: -37px;
    width: 100%;
    // overflow: hidden;

    .create {
      position: fixed;
      bottom: 50px;
      right: 30px;
    }

  }
  .tab {
    padding: 0;
  }
</style>
