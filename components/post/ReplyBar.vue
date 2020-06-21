<template>
  <div>
    
    <!-- 底部功能调 -->
    <div id="footer" class="d-flex align-center" >
      <v-btn rounded depressed @click="handleShowReply" style="flex:1;max-width:60%;">
        {{$t('post.reply')}}
      </v-btn>
      
    </div>
    <!-- 回复模式 -->
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
            v-model="content"
            clearable
            required
            placeholder="Reply..."
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
    commentId: null,
    info: null,
    
  },
  data() {
    return{
      showReply: false,
      content: '',
      replyRule: [
        v => !!v || "Required",
        v => v && v.length <= 200 || "Max 200 characters"
      ],
      isSending: false,
      showDeleteDialog: false
    }
  },
  mounted() {
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
      this.$axios.post('/api/v2/reply/add_reply', {
        commentId: this.commentId,
        content: this.content
      }).then(({data}) => {
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('post.replySuccess')})
        this.content = ''
        this.$emit('sumbitReplySuccess', {})
        this.handleCloseReply()
      }).catch(console.error)
      .finally(()=> {
        this.isSending = false
      })
    },
    
    
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
  z-index: 6;
}
#reply {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  min-height: 80px;
  z-index: 21;
  background-color: white;
  border-top: thin solid grey;
  padding: 16px;
}
</style>