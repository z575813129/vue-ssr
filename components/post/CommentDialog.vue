<template>
  <v-dialog :value="value" fullscreen hide-overlay persistent no-click-animation transition="dialog-bottom-transition">
    <v-card v-if="info" id="main">
      <LoadMore
        id="vueLoad"
        ref="vueLoad"
        @bottom-method="handleBottom"
        @bottom-error-click="handleBottomError"
      >
        <v-toolbar class="comment-header" dark color="primary">
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{info.replyCount+ ' '+ $t('post.reply')}}</v-toolbar-title>
          <span style="width:48px;"></span>
        </v-toolbar>
        <div class="comment-info" v-if="info">
          <div v-if="info.createUser" class="flex info-user">
            <v-avatar size="40">
              <img v-if="info.createUser.avatar" :src="info.createUser.avatar" alt />
              <v-icon v-else size="40">mdi-account-circle</v-icon>
            </v-avatar>
            <div class="info-user-name" @click="$router.push(`/user?id=${info.createUser.id}`)">
              <div class="subtitle-2">{{info.createUser.username}}</div>
              <div
                class="subtitle-2 grey--text"
              >{{new Date(info.createTime) | dateFormat('yyyy-MM-dd HH:mm')}}</div>
            </div>
          </div>
          <div style="margin: 8px" class="d-flex">
            <span class="body-1">{{info.content}}</span>
          </div>
        </div>
        <div style="padding: 0 10px;">
          <div class="title">{{$t('post.reply')}}</div>
          <v-divider />
          <div v-for="(item,i) in list" :key="i">
            <div v-if="!item.isDelete" class="d-flex align-start reply">
              <div class="reply-avatar">
                <v-avatar size="40">
                  <img
                    v-if="item.createUser && item.createUser.avatar"
                    :src="item.createUser.avatar"
                    alt
                  />
                  <v-icon v-else size="40">mdi-account-circle</v-icon>
                </v-avatar>
              </div>
              <div class="reply-main">
                <div class="reply-header flex">
                  <span class="subtitle-2" style="flex:1">{{item.createUser.username}}</span>
                </div>
                <div class="reply-content">
                  <span>{{item.content}}</span>
                </div>
                <div class="reply-footer">
                  <span class>{{new Date(item.createTime) | dateFormat('yyyy-MM-dd HH:mm')}}</span>
                  <v-spacer />
                  <v-btn
                    class
                    v-if="item&&item.createUser&&(item.createUser.id === $store.state.userInfo.id)"
                    style="margin-left:10px;"
                    text
                    icon
                    x-small
                    @click.stop="openDeleteDialog(item)"
                  >
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoadMore>
          <!-- 删除帖子确认框 -->
      <v-dialog
        :value="showDeleteDialog"
        max-width="290"
        @input="closeDeleteDialog"
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
              @click="removeReply"
            >
              {{$t('common.yes')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <ReplyBar
      v-if="commentId"
      :commentId="commentId"
      :info="info"
      @sumbitReplySuccess="sumbitReplySuccess"
    />
  </v-dialog>
</template>

<script>
import ReplyBar from "@/components/post/ReplyBar";
import LoadMore from "@/components/LoadMore";
export default {
  props: {
    value: false,
    commentId: null,
    info: null
  },
  components: { ReplyBar, LoadMore },
  data() {
    return {
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      showDeleteDialog: false,
      deleteItem: null
    };
  },
  mounted() {
    console.log('on comments')
    
  },
  beforeDestroy() {
    console.log('leave comments')
    window.removeEventListener('popstate', this.handleBack, false)
  },
  methods: {
    updateValue(e) {
      this.$emit("input", e.target.value);
    },
    close() {
      window.history.back()
      
    },
    fetchList() {
      this.$axios
        .get(
          `/api/v2/comment/listReplyByCommentId?commentId=${this.commentId}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`
        )
        .then(({ data }) => {
          this.total = data.total;
          if (data.rows) {
            this.list = this.list.concat(data.rows);
          }
          if (this.pageSize * this.pageNum < this.total) {
            this.pageNum+=1
            return true
          }
          return false

        })
        .then(res => this.$refs.vueLoad.onBottomLoaded(res))
        .catch(err => {
          this.$refs.vueLoad.onBottomError();
        });
    },
    openDeleteDialog(item) {
      this.deleteItem= item
      this.showDeleteDialog = true
    },
    closeDeleteDialog() {
      console.log('close delete '+this.deleteItem.id)
      this.deleteItem = null
      this.showDeleteDialog = false
    },
    removeReply() {
      this.$store.dispatch('checkAuth')
      const item = this.deleteItem
      if (item && item.id && item.createUser && item.createUser.id === this.$store.state.userInfo.id) {
        this.$axios.post('/api/v2/reply/remove_reply', {replyId: item.id}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.deleteSuccess')})
          item.isDelete = 1
          this.info.replyCount -=1
        }).catch(console.error).finally(()=>this.closeDeleteDialog())
      }
    },
    sumbitReplySuccess() {
      console.log("reply success");
      this.reset();
      if (this.info) {
        this.info.replyCount += 1;
      }
      this.fetchList();
    },
    reset() {
      this.list = [];
      this.total = 0;
      this.pageNum = 1;
      this.pageSize = 10;
    },
    handleBottom() {
      console.log("loadmore");
      this.fetchList();
      // this.fetchList()
      // loaded('done')
    },
    // 如果是错误状态，点击从新请求数据
    handleBottomError() {
      this.handleBottom();
    },
    handleBack(e) {
      console.log('back')
      window.removeEventListener('popstate', this.handleBack, false)
      if(this.$route.hash) {
        this.$router.replace({ query: this.$route.query, hash: ''})
      }
      this.$emit("input", false);
      // return false
    }
  },
  watch: {
    commentId: function(val, oldVal) {
      console.log("new:" + val);
      console.log("old:" + oldVal);
      this.reset();
      if (val) {
        this.fetchList();
      }
    },
    value: function(val) {
      console.log('comments', val)
      if (val) {
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.handleBack, false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-bottom: 48px !important;
}
.comment-header {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 30;
}
.comment-info {
  padding: 8px;
  margin-top: 56px;
}

.info-user {
  // padding: 5px;
}
.info-user-name {
  margin-right: 5px;
  margin-left: 5px;
}
.reply {
  padding-top: 5px;
  padding-bottom: 5px;
}
.reply-avatar {
  padding-top: 10px;
  padding-right: 5px;
}
.reply-main {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.reply-header {
  width: 100%;
  margin-bottom: 5px;
}
.reply-content {
  margin-right: 5px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.reply-footer {
  display: flex;
}
</style>