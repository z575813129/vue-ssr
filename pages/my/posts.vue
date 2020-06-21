<template>
  <div id="main">
    <loadMore ref="vueLoad" @bottom-method="handleBottom"  @bottom-error-click="handleBottomError" >

    <div>
      <!-- <md-tabs class="md-transparent" @md-changed="tabChanged">
        <md-tab id="0" :md-label="$t('my.posts.released')"></md-tab>
        <md-tab id="1" :md-label="$t('my.posts.commented')"></md-tab>
      </md-tabs> -->
      <v-tabs v-model="tabId" @change="tabChanged" height="36px" >
        <v-tab>{{$t('my.posts.released')}}</v-tab>
        <v-tab>{{$t('my.posts.commented')}}</v-tab>
      </v-tabs>
    </div>
    

    <!-- <md-list v-if="tabId===0" style="padding-left: 0px;" >
      <div @click="$router.push(`/post?id=${item.id}`)" v-for="item in list" :key="item.id">
        <div class="flex ptm plm prm bg-w mb flex-start">
          <md-avatar>
            <img v-if="$store.state.userInfo.avatar" :src="$store.state.userInfo.avatar" alt="People">
            <img v-else src="https://placeimg.com/40/40/people/6" alt="People">
          </md-avatar>
          <div class="f1 mlm">
            <div class="color-o mb">{{item.title}}</div>
            <div>{{item.plainDetail}}</div>
            <div class="r mt">
              <span class="mrm"> <md-icon>input</md-icon> 320</span>
              <span class="mrm"> <md-icon>thumb_up</md-icon>{{item.isLike}}</span>
              <span> <md-icon>favorite</md-icon> {{item.likeCount}}</span>
            </div>
          </div>
        </div>
        <md-divider></md-divider>
      </div>
    </md-list> -->

    <!-- <md-list v-if="tabId===1" class="">
      <div @click="$router.push('/post?id='+commentItem.id)" v-for="(commentItem, commentIndex) in commentList"
           :key="commentIndex">
        <div class="flex ptm plm bg-w mb flex-start">
          <md-avatar>
            <img v-if="commentItem.createUser.avatar" :src="commentItem.createUser.avatar" alt="People">
            <img v-else src="https://placeimg.com/40/40/people/6" alt="People">
          </md-avatar>
          <div class="f1 mlm">
            <div class="color-o mb">{{commentItem.title}}</div>
            <div>{{commentItem.plainDetail}}</div>
            <div class="px mt tr">
              <span class="mrm"><md-icon>insert_drive_file</md-icon> {{commentItem.readCount}}</span>
              <span class="mrm"><md-icon>thumb_up</md-icon> {{commentItem.likeCount}}</span>
              <span> <md-icon>mode_comment</md-icon> {{commentItem.commentCount}}</span>
            </div>
          </div>
        </div>
        <md-divider></md-divider>
      </div>
    </md-list> -->
    <div v-if="tabId==0" >
      <postCell :item="item" v-for="(item, i) in tab0.list" :key="i" />
    </div>
    <div v-if="tabId==1" >
      <postCell :item="item" v-for="(item, i) in tab1.list" :key="i" />
    </div>
    </loadMore>
  </div>
</template>

<script>
  import postCell from '@/components/postCell'
  import LoadMore from '@/components/LoadMore'

  export default {
    name: "myPosts",
    layout: 'vuetify',
    components: {postCell, LoadMore},
    meta: {
      requireAuth: true
    },
    data() {
      return {
        tabId: 0,
        tab0: { // 我发布的帖子
          pageNum: 1,
          pageSize: 10,
          list: [],
          total: 0
        },
        tab1: { // 我评论的帖子
          pageNum: 1,
          pageSize: 10,
          list: [],
          total: 0
        }
      }
    },
    head() {
      return {
        title: this.$t('my.posts.title')
      }
    },
    mounted() {
      this.fetchReleaseList(this.tab0)
      this.fetchCommentList(this.tab1)
    },
    methods: {
      tabChanged(id) {
        this.$refs.vueLoad.reset()
        // this.fetchList()
      },
      async fetchList() {
        try {
          let res = false
          switch(this.tabId) {
            case 0:
              res = await this.fetchReleaseList(this.tab0)
              break
            case 1: 
              res = await this.fetchCommentList(this.tab1)
              break
            default:
              break
          }
          this.$refs.vueLoad.onBottomLoaded(res)
        } catch (err) {
          this.$refs.vueLoad.onBottomError()
        }
        
      },
      fetchReleaseList(tab) {
        return this.$axios.get(`/api/v2/my/listMyPost?pageNum=${tab.pageNum}&pageSize=${tab.pageSize}`).then(({data}) => {
          
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
      fetchCommentList(tab) {
        return this.$axios.get(`/api/v2/my/listMyCommentPost?pageNum=${tab.pageNum}&pageSize=${tab.pageSize}`).then(({data}) => {
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
  .md-avatar {
    margin: initial;
  }

  #main {
    width: 100%;
    height: 100%;
  }

  .md-tabs {
    background: #fff;
    // position: fixed !important;
    // left: 0;
    // right: 0;
    // top: 0;
    // z-index: 1;
  }
  
</style>
