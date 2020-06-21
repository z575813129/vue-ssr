<template>
  <div id="main">
    <loadMore ref="vueLoad" @bottom-method="handleBottom"  @bottom-error-click="handleBottomError" >
    <md-list v-if="messages.length" style="padding-left:0px;" >
      <div @click="readMessage(item)" v-for="item in messages" :key="item.id">
        <div class="ptm plm prm bg-w mb">
          <div class="clearfix">
            <div class="bold" :class="{'grey--text': item.isRead==1}" >{{item.title}}</div>
            <div>{{item.content}}</div>
            <div class="mt r pr">
              <span>{{new Date(item.createTime) | dateFormat('yyyy-MM-dd HH:mm:ss')}}</span>
            </div>
          </div>
        </div>
        <md-divider></md-divider>
      </div>
    </md-list>

    </loadMore>

  </div>
</template>

<script>
  import LoadMore from '@/components/LoadMore'
  export default {
    name: "myMessages",
    layout: 'vuetify',
    meta: {
      requireAuth: true
    },
    components: {LoadMore},
    data() {
      return {
        messages: [], // 我的消息
        pageNum: 1,
        pageSize: 20,
        total: 0
      }
    },
    head() {
      return {
        title: this.$t('my.messages.title')
      }
    },
    mounted() {
      this.fetchMessages()
    },
    methods: {
      fetchMessages() {
        this.$axios.get(`/api/v2/my/listMyMessage?pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(({data}) => {
        
          this.total = data.total
          // this.list = data.rows
          if (!data.rows || data.rows.length == 0) {
            this.$refs.vueLoad.onBottomLoaded(false)
          } else {
            this.messages = this.messages.concat(data.rows)
            this.pageNum+=1
            this.$refs.vueLoad.onBottomLoaded(true)
          }
        }).catch(console.error)
      },
      readMessage(item) {
        this.$router.push(item.url)
        this.$axios.post('/api/v2/my/readMessage', {messageId: item.id}).then(({data}) => {
          
        }).catch(console.error)
      },
      handleBottom() {
        console.log('loadmore')
        this.fetchMessages()
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
    height: 100%;
    width:100%;
  }

</style>
