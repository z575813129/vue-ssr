<template>
  <div id="main">
    <loadMore ref="vueLoad" @bottom-method="handleBottom"  @bottom-error-click="handleBottomError" >
    <div id="head">
      <v-tabs v-model="tabId"  @change="tabChanged" height="36px" >
        <!-- <v-tab value="latest" exact nuxt :to="{path: '/category', query: {category,sort:'latest'}}">{{$t('category.latest')}}</v-tab>
        <v-tab value="hot" exact nuxt :to="{path: '/category', query: {category,sort:'hot'}}">{{$t('category.hot')}}</v-tab>
        <v-tab value="release" exact nuxt :to="{path: '/category', query: {category,sort:'release'}}">{{$t('category.release')}}</v-tab> -->
        <v-tab class="tab" >{{$t('category.latest')}}</v-tab>
        <v-tab class="tab">{{$t('category.hot')}}</v-tab>
        <v-tab class="tab">{{$t('category.release')}}</v-tab>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click.stop="overlay=true"
          style="margin:auto; margin-right:5px;"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
        <!-- <v-menu :close-on-click="true" >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
              style="margin:auto; margin-right:12px;"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list >
            <v-list-item-group :value="category" >
              <v-list-item
                v-for="item in categories"
                :key="item.code"
                :value="item.code"
                @click="()=>$router.push(`/category?category=${item.code}`)"
              >
                {{ item.name }}
              </v-list-item>
            </v-list-item-group>
            
            </v-list>
        </v-menu> -->
      </v-tabs>
      
    </div>
    <v-dialog v-model="overlay">
      <v-list >
        <v-list-item-group :value="category" >
          <v-list-item
            v-for="item in categories"
            :key="item.code"
            :value="item.code"
            @click="()=>$router.push(`/category?category=${item.code}`)"
          >
          <!-- <nuxt-link :to="`/category?category=${item.code}`" >{{ item.name }}</nuxt-link> -->
            {{ $t('common.categories.'+item.code) }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-dialog>
    <div id="content">
      <postCell :item="item" v-for="(item, i) in topList" :key="i" />
      <!-- <div v-if="tabId==0" >
        <postCell :item="item" v-for="(item, i) in tab[0].list" :key="i" />
      </div>
      <div v-if="tabId==1" >
        <postCell :item="item" v-for="(item, i) in tab[1].list" :key="i" />
      </div>
      <div v-if="tabId==2" >
        <postCell :item="item" v-for="(item, i) in tab[2].list" :key="i" />
      </div> -->
      <div v-if="tabs[tabId]" >
        <postCell :item="item" v-for="(item, i) in tabs[tabId].list" :key="i" />
      </div>
    </div>
    <div class="create">
      <v-btn color="primary" fab @click="$router.push('/my/postCreate')" >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    </loadMore>
  </div>
</template>

<script>
  import postCell from '@/components/postCell'
  import LoadMore from '@/components/LoadMore'
  export default {
    name: "category",
    layout: 'vuetify',
    key (route) {
      return route.fullPath
    },
    components: {postCell, LoadMore},
    data() {
      return {
        tabId: 0,
        topList: [], // 置顶列表
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
        // sort: 'latest', // 排序,hot最热的，latest最新的，release最近发布的

        overlay: false
      }
    },
    head() {
      return {
        title: 'BAAC - '+this.$route.query.category,
        meta: [
          {hid: 'keywords', name: 'keywords', content: 'Forum, BAAC,' + this.$route.query.category}
        ]
      }
    },
    computed: {
      category() {
        return this.$route.query.category || 'Other'
      },
      sort() {
        // return this.$route.query.sort || 'latest'
        switch(this.tabId) {
          case 1:
            return 'hot';
          case 2:
            return 'release';
          default:
            return 'latest';
        }
      },
      categories() {
        return this.$store.state.categories
      }
    },
    mounted() {
      this.fetchTopList()
      this.$refs.vueLoad.emitBottomMethod()
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
            const res = await this.fetchListByCateogory(tab)
            this.$refs.vueLoad.onBottomLoaded(res)
          }
          
        } catch (err) {
          this.$refs.vueLoad.onBottomError()
        }
      },
      fetchListByCateogory(tab) {
        return this.$axios.get(`/api/v2/listPostByCategory?sort=${tab.sort}&category=${this.category}&pageNum=${tab.pageNum}&pageSize=${tab.pageSize}`).then(({data}) => {
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
      fetchTopList() {
        this.$axios.get(`/api/v2/listTopPostByCategory?category=${this.category}&pageNum=1&pageSize=20`).then(({data}) => {
         
          this.topList = data.rows
         
        }).catch(err=>{})
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
  // background-color: yellow;
  // position: absolute;
  height: 100%;
  width: 100%;
}

#head {
  // margin: -12px;
  // height: 38px;
  width: 100%;
}

#content {
  // background-color: white;
  // height: 100%;
  width: 100%;
}

.tab {
  padding: 0;
}
.create {
  position: fixed;
  bottom: 50px;
  right: 30px;
}
</style>
