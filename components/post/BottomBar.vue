<template>
  <div>
    <!-- 删除帖子确认框 -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">{{$t('post.deletePostTips')}}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            @click="showDeleteDialog = false"
          >
            {{$t('common.cancel')}}
          </v-btn>

          <v-btn
            color="error"
            @click="deletePost"
          >
            {{$t('common.yes')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 底部功能调 -->
    <div id="footer" class="d-flex align-center" >
      <v-btn rounded depressed @click="handleShowReply" style="flex:1">
        {{$t('post.comment')}}
      </v-btn>
      <div class="" style="margin-left:10px;">
        <v-btn icon @click="goToComments">
          <v-badge
            :content="info.commentCount"
            :value="info && info.commentCount"
            color="red"
            overlap
            
          >
            <v-icon>mdi-comment</v-icon>
          </v-badge>
        </v-btn>
        <v-btn class="" text icon :color="info&&info.isCollection? 'primary':''" @click="collect">
            <v-badge
              :content="info.collectionCount"
              :value="info && info.collectionCount"
              color="red"
              overlap
            >
            <v-icon>mdi-star</v-icon>
          </v-badge>
        </v-btn>
        <v-btn class="" text icon :color="info&&info.isLike? 'primary':''" @click="like">
            <v-badge
              :content="info.likeCount"
              :value="info && info.likeCount"
              color="red"
              overlap
            >
            <v-icon>mdi-thumb-up</v-icon>
          </v-badge>
        </v-btn>
        <v-menu top left v-if="info&&info.createUser&&(info.createUser.id === $store.state.userInfo.id)">
          <template v-slot:activator="{ on }">
            <v-btn
              light
              icon
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              @click="$router.push(`/my/postEdit?id=${postId}`)"
            >
              <v-list-item-title>{{$t('common.edit')}}</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click.stop="handleDelete"
            >
              <v-list-item-title>{{$t('common.delete')}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      
    </div>
    <!-- 评论模式 -->
    <v-overlay :value="showReply" z-index="10" >
      <div style="position: fixed;top:0;right:0;left:0;width:100%;height:100%;z-index:15;"  @click="handleCloseReply" ></div>
      <div id="reply" class="flex align-center">
        <v-form ref="form" style="width:100%">
          <v-textarea 
            z-index=20
            autofocus
            auto-grow
            outlined
            filled
            light
            rows="4"
            counter="200"
            :rules="replyRule"
            v-model="reply"
            clearable
            required
            placeholder="Comment..."
          >
          </v-textarea>
        </v-form>
        
        <v-btn height="80px" width="60px" color="primary" style="margin-left:10px;" @click="handleSubmit" >
          {{$t('common.submit')}}
        </v-btn>
      </div>
    </v-overlay>
    
  </div>
</template>

<script>
export default {
  props: {
    postId: null,
    info: null,
    
  },
  data() {
    return{
      showReply: false,
      reply: '',
      replyRule: [
        v => !!v || "Required",
        v => v && v.length <= 200 || "Max 200 characters"
      ],
      isSending: false,
      showDeleteDialog: false
    }
  },
  mounted() {
    console.log(this.info)
  },
  methods: {
    handleShowReply() {
      console.log('open')
      this.$store.dispatch('checkAuth')
      this.showReply=true
    },
    handleCloseReply() {
      console.log('close')
      this.showReply=false
      this.isSending = false
    },
    handleSubmit() {
      if (!this.$refs['form'].validate()) {
        return
      }
      this.$store.dispatch('checkAuth')
      this.isSending = true
      this.$axios.post('/api/v2/comment/create', {
        postId: this.postId,
        content: this.reply
      }).then(({data}) => {
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.commentSuccess')})
        this.reply = ''
        this.$emit('sumbitCommentSuccess', {})
        this.handleCloseReply()
      }).catch(console.error)
      .finally(()=> {
        this.isSending = false
      })
    },
    goToComments() {
      // console.log('abc')
      this.$emit('goToComments', {})
    },
    like() {
      // this.$store.dispatch('checkAuth')
      if (this.info.isLike) {
        this.removeLikePost()
      } else {
        this.likePost()
      }
    },
    // 点赞
    likePost() {
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/post/likePost', {postId: this.postId}).then(({data}) => {
        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.likeSuccess')})
        this.info.isLike = 1
        this.info.likeCount+=1
          // this.fetchDetail()
        
      }).catch(console.error)
    },
    // 取消点赞
    removeLikePost() {
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/post/removeLikePost', {postId: this.postId}).then(({data}) => {
        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.cancelSuccess')})
        this.info.isLike = 0
        this.info.likeCount-=1
        // this.fetchDetail()
        
      }).catch(console.error)
    },
    cancelCollect() {
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/post/cancelCollection', {postId: this.postId}).then(({data}) => {
        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.cancelSuccess')})
        this.info.isCollection = 0
         this.info.collectionCount-=1
          // this.fetchDetail()
        
      }).catch(console.error)
    },
    collect() {
      if (this.isCollection) {
        this.cancelCollect()
        return
      }
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/post/collectionPost', {postId: this.postId}).then(({data}) => {
        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.collectSuccess')})
        this.info.isCollection = 1
        this.info.collectionCount+=1
        
      }).catch(console.error)
    },
    deletePost() {
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/post/deletePost', {postId: this.postId}).then(({data}) => {
        
      this.$router.replace({
        path: '/',
        query: {
          t: Date.now()
        }
      })
        
      }).catch(err=>{})
    },
    handleDelete() {
      this.$store.dispatch('checkAuth')
      this.showDeleteDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
#footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 48px;
  background-color: white;
  border-top: thin solid grey;
  padding-left: 16px;
  padding-right: 16px;
  z-index: 5;
}
#reply {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  min-height: 80px;
  z-index: 20;
  background-color: white;
  border-top: thin solid grey;
  padding: 16px;
}
</style>