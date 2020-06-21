<template>
  <div class="detail header-top">
    <!-- <v-dialog
            v-model="showDialog"
            max-width="290"
          >
            <v-card>
              <v-card-title class="headline">Do you want to delete this post?</v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  type="danger"
                  @click="dialog = false"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
    <md-dialog :md-cancel-text="$t('common.cancel')" :md-confirm-text="$t('common.submit')"
               :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>Do you want to delete this post?</md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog=false">{{$t('common.cancel')}}</md-button>
        <md-button class="md-primary" @click="deletePost">{{$t('common.submit')}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div class="fixed">
      <md-toolbar class="md-primary">
        <div @click="$router.go(-1)">
          <md-icon class="white">arrow_back</md-icon>
        </div>
        <h2 class="md-title white" style="flex: 1">Detail</h2>
        <div class="md-toolbar-section-end pl" v-if="info&&(info.createUser.id === $store.state.userInfo.id)">
          <md-menu md-size="small" md-align-trigger md-direction="bottom-end">
            <!--<md-button md-menu-trigger>Align with trigger</md-button>-->
            <md-button md-menu-trigger class="md-icon-button white right-menu ">. . .
            </md-button>

            <md-menu-content>
              <!-- <md-menu-item @click="cancleCollect" v-if="info&&info.isCollection">{{$t('post.cancelCollect')}}
              </md-menu-item>
              <md-menu-item @click="collect" v-else>{{$t('post.collect')}}</md-menu-item> -->
              <md-menu-item
                @click="$router.push(`/my/postEdit?id=${$route.query.id}&category=${$route.query.category}`)">
                {{$t('common.edit')}}
              </md-menu-item>
              <md-menu-item @click.stop="showDialog=true">{{$t('common.delete')}}</md-menu-item>
            </md-menu-content>
          </md-menu>
          
        </div>
        
        <div v-else>
          <md-button class="md-icon-button" v-if="info&&info.isCollection" @click="cancleCollect">
            <md-icon class="color-accent">star</md-icon>
          </md-button>

          <md-button class="md-icon-button" v-else @click="collect">
            <md-icon class="white">star_border</md-icon>
          </md-button>
        </div>
      </md-toolbar>
    </div>
    <div class="px">
      <p class="md-title" v-if="info">{{info.title}}</p>
      <div class="flex ptm" v-if="info&&info.createUser"
           @click="$router.push(`/user?id=${info.createUser.id}`)">
        <md-avatar>
          <img v-if="info.createUser.avatar" :src="info.createUser.avatar" alt="People">
          <img v-else src="~/assets/imgs/user.png" alt="People">
        </md-avatar>

        <div class="md-list-item-text mlm color-o">
          <span>{{info.createUser.username}}</span>
          <span class="mts">{{new Date(info.createTime) | dateFormat('yyyy-MM-dd')}}</span>
        </div>
      </div>
    </div>
    <md-divider></md-divider>
    <div class="px" v-if="info">
      <div v-html="info.detail"></div>
    </div>
    <div class="clearfix">
      <div class="prm r" v-if="info">
        <span class="mrm"><md-icon>insert_drive_file</md-icon> {{info.readCount}}</span>
        <span class="mrm" @click="like"><md-icon>thumb_up</md-icon> {{info.likeCount}}</span>
        <span @click="openCommentInvitation(0, info)"> <md-icon>mode_comment</md-icon> {{info.commentCount}}</span>
      </div>
    </div>

    <h2 class="md-title plm">{{$t('post.comments')}}</h2>

    <md-divider></md-divider>


    <div class="footer-bottom">
      <!--<spanner class="spanner" v-if="loading" style="padding-top: 30%"></spanner>-->
      <div v-if="!loading&&!commentList.length" class="spinner color-h" style="padding-top: 30%">
        <div class="flex fc">
          <img src="@/assets/imgs/null.png" alt="">
        </div>
        <p class="tc mt">{{$t('common.noData')}}</p>
      </div>
      <div class="px" v-for="item in commentList" :key="item.id">
        <div class="flex flex-start">
          <div @click="$router.push(`/user?id=${item.createUser.id}`)">

            <md-avatar>
              <img v-if="item.createUser.avatar" :src="item.createUser.avatar" alt="People">
              <img v-else src="~/assets/imgs/user.png" alt="People">
            </md-avatar>

          </div>

          <div class="f1 clearfix bb pb">
            <div class=" mlm ">
              <div class="flex fb">
                <div class="col-90">
                  <div class="color-o">{{item.createUser.username}}</div>
                  <div class="mts color-h ">{{new Date(item.createTime)| dateFormat('yyyy-MM-dd')}}</div>
                </div>
                <div @click="removeComment(item)" class=" f1  prm" v-if="item.createUser.id===$store.state.userInfo.id">
                  <md-icon class="color-accent col-100">delete</md-icon>
                </div>

              </div>
              <p class="mtm">{{item.content}} </p>
            </div>
            <div class="r color-h" v-if="info">
              <span class="mrm " @click="aboutComment(item)"><md-icon>thumb_up</md-icon> {{item.likeCount}}</span>
              <span class="fs" @click="openCommentInvitation(1,item)">
                <md-icon>mode_comment</md-icon>
                {{item.replyCount}}</span>
            </div>
            <div style="margin-top: 45px" v-if="item.open">
              <div class="" v-for="replyItem in item.replyList" :key="replyItem.id">
                <div class="flex bt pb pt flex-start">
                  <div @click="$router.push(`/user?id=${item.createUser.id}`)">
                    <md-avatar @click="$router.push(`/user?id=${info.createUser.id}`)">
                      <img class="reply-icon" v-if="replyItem.createUser.avatar" :src="replyItem.createUser.avatar"
                           alt="People">
                      <img class="reply-icon" v-else src="~/assets/imgs/user.png" alt="People">
                    </md-avatar>
                  </div>
                  <div class="f1">
                    <div class="mlm">
                      <div class="flex fb">
                        <div class="col-90">
                          <span class="color-o mrm">{{replyItem.createUser.username}}</span>
                          <span
                            class="mts color-h ">{{new Date(replyItem.createTime) | dateFormat('yyyy-MM-dd')}}</span>
                        </div>
                        <div @click="removeReply(replyItem,item)" class=" f1  prm"
                             v-if="replyItem.createUser.id===$store.state.userInfo.id">
                          <md-icon class="color-accent col-100">delete</md-icon>
                        </div>

                      </div>
                      <div class="mt">{{replyItem.content}} </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <md-toolbar class="footer " v-if="showComment">
      <input v-model="commentValue" class="col-70" ref="commentValue" placeholder="comment...">
      <md-button class="md-raised md-accent md-toolbar-section-end" @click="complete">{{$t('common.submit')}}</md-button>
    </md-toolbar>

  </div>
</template>


<script>
  import spanner from 'vue-spinner/src/PulseLoader.vue'
  export default {
    name: "post2",
    meta: {
      requireAuth: false
    },
    components: {spanner},
    head() {
      return {
        title: this.$route.query.title,
        meta: [
          {
            hid: 'post' + this.$route.query.id,
            name: this.$route.query.title,
            content: '论坛, BAAC,' + this.$route.query.title
          }
        ]
      }
    },
    data() {
      return {
        loading: false,
        info: null,
        showComment: false,
        commentValue: '',
        showDialog: false,
        pageNum: 1,
        pageSize: 100,
        commentList: [], // 所有的评论
        type: 0, // 提交类型0评论，1回复评论
        commentItem: null, // 当前评论的对象
        postId: null
      }
    },
    mounted() {
      this.postId = this.$route.query.id
      this.fetchDetail()
    },
    methods: {
      deletePost() {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/post/deletePost', {postId: this.postId}).then(({data}) => {
          
        this.$router.replace('/')
          
        }).catch(err=>{})
      },
      cancleCollect() {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/post/cancelCollecton', {postId: this.$route.query.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.cancelSuccess')})
          this.info.isCollection = 0
            // this.fetchDetail()
          
        }).catch(console.error)
      },
      collect() {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/post/collectonPost', {postId: this.$route.query.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.collectSuccess')})
          this.info.isCollection = 1
            // this.fetchDetail()
          
        }).catch(console.error)
      },
      like() {
        this.$store.dispatch('checkAuth')
        if (this.info.isLike) {
          this.removeLikePost()
        } else {
          this.likePost()
        }
      },
      // 点赞
      likePost() {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/post/likePost', {postId: this.$route.query.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.likeSuccess')})
          this.info.isLike = 1
          this.info.likeCount+=1
            // this.fetchDetail()
          
        }).catch(console.error)
      },
      // 取消点赞
      removeLikePost() {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/post/removeLikePost', {postId: this.$route.query.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.cancelSuccess')})
          this.info.isLike = 0
          this.info.likeCount-=1
          // this.fetchDetail()
          
        }).catch(console.error)
      },
      
      // 删除评论
      removeComment(item) {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/comment/removeComment', {commentId: item.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.deleteSuccess')})
          this.fetchDetail()
          
        }).catch(console.error)
      },
      // 取消回复评论
      removeReply(item ,parentItem) {
        this.$store.dispatch('checkAuth')
        this.$axios.post('/api/v2/reply/remove_reply', {replyId: item.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.deleteSuccess')})
          this.fechReplyList(parentItem)
          this.fetchDetail()
          
        }).catch(console.error)
      },
      // 查看帖子详情
      fetchDetail() {
        this.$axios.get(`/api/v2/post/getPostInfo?postId=${this.$route.query.id}`).then(({data}) => {
          
          this.info = data
          this.fetchCommentList()
          
        }).catch(console.error)
      },
      // 获取所有评论
      fetchCommentList() {
        // this.commentList = []
        // this.loading = true
        this.$axios.get(`/api/v2/post/listCommentByPostId?postId=${this.$route.query.id}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(({data}) => {
          
          if (data.rows.length) {
            for (let item of data.rows) {
              item.open = false
              item.replyList = []
            }
            this.commentList = data.rows
          }
          
          // this.loading = false
        }).catch(console.error)
      },
      // 显示弹出评论框
      openCommentInvitation(type, item) {
        this.type = type
        this.showComment = !this.showComment
        if (this.showComment) {
          item.open = true
          this.commentItem = item
          this.fechReplyList(item)
          setTimeout(() => {
            this.$refs['commentValue'].focus()
          }, 500)
        } else {
          item.open = false
        }
      },
      complete() {
        if (this.type) {
          this.replyInvitation()
        } else {
          this.commitInvitation()
        }
      },
      // 发表评论
      commitInvitation() {
        this.$store.dispatch('checkAuth')
        if (!this.commentValue) {
          this.$store.commit('SHOW_TOAST', {show: true, content: 'comment can not be empty'})
          return
        }
        this.$axios.post('/api/v2/comment/create', {
          postId: this.$route.query.id,
          content: this.commentValue
        }).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.commentSuccess')})
          this.fetchDetail()
          
          this.showComment = false
          this.commentValue = ''
        }).catch(console.error)
      },
      // 回复评论
      replyInvitation() {
        this.$store.dispatch('checkAuth')
        if (!this.commentValue) {
          this.$store.commit('SHOW_TOAST', {show: true, content: 'comment can not be empty'})
          return
        }
        this.$axios.post('/api/v2/reply/add_reply', {
          postId: this.$route.query.id,
          commentId: this.commentItem.id,
          content: this.commentValue
        }).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.commentSuccess')})
          this.fetchDetail()
          
          this.showComment = false
          this.commentValue = ''
        }).catch(console.error)
      },
      // 发表评论
      fechReplyList(item) {
        this.$axios.get(`/api/v2/comment/listReplyByCommentId?commentId=${item.id}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(({data}) => {
         
          item.replyList = data.rows
          
        }).catch(console.error)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .md-list-item-text {
    overflow: auto;
    white-space: normal
  }

  .reply-icon {
    width: 30px;
    height: 30px;
    border-radius: 20px;
  }

  .pl40 {
    margin-left: 40px;
  }

  .md-avatar {
    margin: initial;
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    text-align: center;

    .md-button {
      border-radius: 20px;
      height: 30px;
    }

    input {
      margin: auto;
      height: 30px;
      outline: none;
      border: none;
      padding: 2px 15px;
      border-radius: 20px;
      box-shadow: 1px 1px 8px #868d8b;
    }
  }


</style>
