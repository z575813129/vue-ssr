<template>
  <div id="comments" name="comments" >
    <div class="title">
      {{$t('post.comments')}}
    </div>
    <v-divider></v-divider>
    <div v-for="(item,i) in list" :key="i">
      <div v-if="!item.isDelete" class="d-flex align-start comment">

      
      <div class="comment-avatar" >
        <v-avatar size="40">
          <img v-if="item.createUser && item.createUser.avatar" :src="item.createUser.avatar" alt="">
          <v-icon v-else size="40">mdi-account-circle</v-icon>
        </v-avatar>
      </div>
      <div class="comment-main">
        <div class="comment-header flex" >
          <span class="subtitle-2" style="flex:1">{{item.createUser.username}}</span>
          <span>{{item.likeCount}}&nbsp;</span>
          <v-btn class="" text icon x-small @click="aboutComment(item)">
            
            <v-icon :color="item&&item.isLike ? 'primary': ''">mdi-thumb-up</v-icon>
          </v-btn>
        </div>
        <div class="comment-content">
          <span>{{item.content}}</span>
        </div>  
        <div class="comment-footer">
          <span class="">{{new Date(item.createTime) | dateFormat('yyyy-MM-dd HH:mm')}}</span>
          ·
          <v-btn x-small rounded depressed class="grey lighten-2" @click.stop="handleReply(item)">{{item.replyCount || ''}}{{$t('post.reply')}}</v-btn>
          <v-spacer/>
          <v-btn class="" v-if="item&&item.createUser&&(item.createUser.id === $store.state.userInfo.id)" style="margin-left:10px;" text icon x-small 
            @click.stop="openDeleteDialog(item)" 
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </div>
        </div>
      </div>
      
    </div>
    <!-- 删除帖子确认框 -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">{{$t('post.deleteCommentTips')}}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="closeDeleteDialog"
          >
            {{$t('common.cancel')}}
          </v-btn>

          <v-btn
            color="error"
            @click="removeComment"
          >
            {{$t('common.yes')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 回复窗口 -->
    <CommentDialog v-if="comment" :commentId="comment.id" :info="comment.info" v-model="comment.showDialog" />
  </div>
</template>

<script>
import CommentDialog from '@/components/post/CommentDialog'
const qs = require('querystring')

export default {
  props: {
    postId: null
  },
  components: { CommentDialog },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      list: [],
      total: 0,
      showDeleteDialog: false,
      deleteItem: null,
      comment: {
        showDialog: false,
        id: null,
        info: null,
      }
    }
  },
  mounted() {
    console.log(this.postId)
    this.fetchList()

    // 如果hash中有有commentId,打开评论详情页
    const hashes = qs.parse(this.$route.hash.substring(1))
    console.log(hashes)
    const { commentId, replyId} = hashes
    if (commentId) {
      this.$axios
        .get(`/api/v2/comment/getCommentInfo?commentId=`+commentId)
        .then(({data}) => {
          if (data && data.postId == this.postId) {
            this.handleReply(data)
          }
        })
        .catch(console.error)
    }
    // console.log(hashes)
  },
  methods: {
    refresh() {
      this.pageNum=1
      this.list = []
      this.total=0
      this.fetchList()
    },
    fetchList() {
      this.$axios.get(`/api/v2/post/listCommentByPostId?postId=${this.postId}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(({data}) => {
        
        this.total = data.total
        // this.list = data.rows
        if (!data.rows || data.rows.length == 0) {
          this.$emit('changeCommentsStatus', 'noData')
        } else {
          this.list = this.list.concat(data.rows)
          this.pageNum+=1
          this.$emit('changeCommentsStatus', 'wait')

        }
        
      }).catch(()=>this.$emit('changeCommentsStatus', 'error'))
    },
    // 点赞评论
    likeComment(item) {
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/comment/likeComment', {commentId: item.id}).then(({data}) => {
        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.likeSuccess')})
        item.isLike = 1
        item.likeCount+=1
        
      }).catch(console.error)
    },
    
    // 取消点赞评论
    removeLikeComment(item) {
      this.$store.dispatch('checkAuth')
      this.$axios.post('/api/v2/comment/removeLikeComment', {commentId: item.id}).then(({data}) => {
        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.cancelSuccess')})
        item.isLike = 0
        item.likeCount-=1
        // this.fetchCommentList()
        
      }).catch(console.error)
    },
    // 点赞评论相关
    aboutComment(item) {
      if (item.isLike) {
        this.removeLikeComment(item)
      } else {
        this.likeComment(item)
      }
    },
    openDeleteDialog(item) {
      this.$store.dispatch('checkAuth')
      console.log(item)
      if (item && item.id && item.createUser && item.createUser.id === this.$store.state.userInfo.id) {
        this.showDeleteDialog = true
        this.deleteItem=item
      }
    },
    closeDeleteDialog() {
      this.showDeleteDialog = false
      this.deleteItem=null
    },
    // 删除评论
    removeComment() {
      this.$store.dispatch('checkAuth')
      const item = this.deleteItem
      if (item && item.id && item.createUser && item.createUser.id === this.$store.state.userInfo.id) {
        this.$axios.post('/api/v2/comment/removeComment', {commentId: item.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.deleteSuccess')})
          item.isDelete = 1
        }).catch(console.error).finally(()=>this.closeDeleteDialog())
      }
      
    },
    handleReply(item) {
      this.comment.id = item.id
      this.comment.info = item
      this.comment.showDialog = true
    },
  }
}
</script>

<style lang="scss" scoped>
#comments {
  padding: 10px;
  // height: 100vh;
}
.comment {
  padding-top: 5px;
  padding-bottom: 5px;

}
.comment-avatar {
  padding-top: 10px;
  padding-right: 5px;
}
.comment-main {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.comment-header {
  width: 100%;
  margin-bottom: 5px;
}
.comment-content {
  margin-right: 5px;
  margin-bottom: 5px;
}
.comment-footer {
  display: flex;
  
}
</style>