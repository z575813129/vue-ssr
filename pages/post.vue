<template>
  <div id="main" class="">
    <LoadMore id="vueLoad" ref="vueLoad" @bottom-method="handleBottom"  @bottom-error-click="handleBottomError" >
    <!-- 帖子主体内容 -->
    <div id="info" v-if="info">
      <div v-if="info.createUser" class="flex info-user">
        <v-avatar size="40">
          <img v-if="info.createUser.avatar" :src="info.createUser.avatar" alt="">
          <v-icon v-else size="40">mdi-account-circle</v-icon>
        </v-avatar>
        <div class="info-user-name" @click="$router.push(`/user?id=${info.createUser.id}`)">
          <div class="subtitle-2">{{info.createUser.username}}</div>
          <div class="subtitle-2 grey--text">{{new Date(info.createTime) | dateFormat('yyyy-MM-dd HH:mm')}}</div>
        </div>
      </div>
      <div class="d-flex" >
        <v-icon v-if="info.isTop" midd class="red--text" >arrow_upward</v-icon>
        <span class="title" :class="{'red--text':info.isNotice==1}">{{info.title}}</span>
        
      </div>
      
      <v-divider></v-divider>
      <div class="detail">
        <div v-html="info.detail"></div>
      </div>
      <div class="info-footer">
        <span class="caption grey--text">{{info.readCount+' '+$t('post.read')}}</span>
      </div>
    </div>
    <!-- 评论 -->
    <comments ref="comments" :postId="postId" @changeCommentsStatus="changeCommentsStatus" />
    </LoadMore>
    <!-- 底部功能栏 -->
    <bottom-bar v-if="postId&&info" :postId="postId" :info="info" @sumbitCommentSuccess="sumbitCommentSuccess" @goToComments="goToComments" />
    
  </div>
</template>


<script>
  import Comments from '@/components/post/Comments'
  import BottomBar from '@/components/post/BottomBar'
  import LoadMore from '@/components/LoadMore'

  export default {
    name: "post",
    components: {Comments,BottomBar,LoadMore},
    meta: {
      requireAuth: false,
    },
    layout: 'vuetify',
    key (route) {
      return route.fullPath.split('#')[0]
    },
    head() {
      return {
        title: this.title,
        meta: [
        ]
      }
    },
    async asyncData({query,app, error}) {
      const postId = query.id
      // console.log(app.i18n.vm.$t)
      if (!postId) {
        return error({ statusCode: 404, message: 'Page not found' })
      }
      try {
        const {data} = await app.$axios.get(`/api/v2/post/getPostInfo?postId=${postId}`)
        if (!data || !data.id || data.isDelete) {
          return error({ statusCode: 404, message: 'Page not found' })
        }
        return {
          postId,
          info: data,
          title: data.title,
        }
      } catch (err) {
        return error({ statusCode: 404, message: app.i18n._t('common.notFound', app.i18n.locale, app.i18n._getMessages()) })
      }
      
    },
    mounted() {
      // this.postId = this.$route.query.id
      // this.fetchDetail()
      this.initWxJssdk()
    },
    methods: {
      initWxJssdk() {
        const url = window.location.href.split('#')[0]
        const wx = window.wx
        if (!wx)
          return
        this.$axios.post('/api/v2/auth/createJsapiSign', { url})
          .then(({data}) => {
            console.log(data)
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature,// 必填，签名
              jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
            })
          })
          .catch(err=>{})
        wx.ready(()=> {
          wx.updateAppMessageShareData({ 
            title: this.info.title, // 分享标题
            desc: this.info.plainDetail, // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: this.info.mainImage, // 分享图标
            success: function () {
              // 设置成功
            }
          })
          wx.updateTimelineShareData({ 
            title: this.info.title, // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: this.info.mainImage, // 分享图标
            success: function () {
              // 设置成功
            }
          })
        })
        wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          console.error(res)
        });
      },
      sumbitCommentSuccess() {
        this.$refs.comments.refresh()
      },
      goToComments() {
        // console.log('123')
        this.$vuetify.goTo(this.$refs.comments, {
          duration: 300,
          offset: 0,
          easing: 'easeInOutCubic',
          container: '#vueLoad'
        })
      },
      
      // 查看帖子详情
      fetchDetail() {
        this.$axios.get(`/api/v2/post/getPostInfo?postId=${this.$route.query.id}`).then(({data}) => {
          
          this.info = data
          
        }).catch(console.error)
      },
      handleBottom() {
        console.log('loadmore')
        this.$refs.comments.fetchList()
        // this.fetchList()
        // loaded('done')
      },
      // 如果是错误状态，点击从新请求数据
      handleBottomError(){
        this.handleBottom()
      },
      changeCommentsStatus(status) {
        console.log(status)
        switch(status) {
          case 'wait':
            this.$refs.vueLoad.onBottomLoaded(true)
            break
          case 'noData':
            this.$refs.vueLoad.onBottomLoaded(false)
            break
          case 'error':
            this.$refs.vueLoad.onBottomError()
            break
          default:
            break
        }
      }
      
    }
  }
</script>

<style lang="scss" scoped>
#main {
  height: 100%;
  width: 100%;
  padding-bottom: 48px;
  overflow: hidden;
}
#info {
  padding:8px;
}

.info-user {
  // padding: 5px;
}
.info-user-name {
  margin-right: 5px;
  margin-left: 5px;
}
.detail {
  padding:5px;
}
.info-footer {
  padding-left: 5px;
}

</style>
