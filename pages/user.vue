<template>
  <div class="detail header-top">
    <div class="fixed">
      <md-toolbar class="md-primary">
        <div @click="$router.go(-1)">
          <md-icon class="white">arrow_back</md-icon>
        </div>
        <h2 v-if="info" class="md-title white" style="flex: 1">{{info.username}}    {{$t('user.homePage')}}</h2>
      </md-toolbar>
    </div>


    <div class="px" v-if="info">
      <div class="flex pbm ptm">
        <md-avatar class="md-large mrm">
          <img v-if="info.avatar" :src="info.avatar" alt="People">
          <img v-else src="https://placeimg.com/40/40/people/6" alt="People">
        </md-avatar>
        <div class="md-list-item-text mlm">
          <span> {{info.username}} <span class="mlm">{{gender}}</span></span>
          <span class="mts"> {{info.email}}</span>
        </div>
      </div>
    </div>
    <div class="color-primary plm pb" v-if="info">{{info.gender != 2? this.$t('user.he'):this.$t('user.she')}}&nbsp;{{$t('user.posts')}}</div>
    <md-divider></md-divider>
    
    <postCell :item="item" v-for="item in list" :key="item.id" />
  </div>
</template>


<script>
  import LoadMore from '@/components/LoadMore'
  import postCell from '@/components/postCell'
  export default {
    name: "user",
    components: {postCell,LoadMore},
    meta: {
      requireAuth: false
    },
    key (route) {
      return route.fullPath
    },
    data() {
      return {
        list: [],
        showDialog: false,
        showComment: false,
        commentValue: '',
        info: null,
        pageNum: 1,
        pageSize: 10
      }
    },
    computed: {
      gender() {
        if (this.info) {
          if (this.info.gender == 1) {
            return this.$t('common.male')
          } else if (this.info.gender == 2) {
            return this.$t('common.female')
          }
        }
        return this.$t('common.unknown')
      }
    },
    mounted() {
      this.fetchDetail()
    },
    methods: {
      // 查看详情
      fetchDetail() {
        this.$axios.get(`/api/v2/user/fetchInfo?uid=${this.$route.query.id}`).then(({data}) => {
          
          this.info = data
          this.fetchList()
          
        }).catch(console.error)
      },
      fetchList() {
        this.$axios.get(`/api/v2/user/listPost?uid=${this.$route.query.id}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(({data}) => {
          
          this.list = data.rows
          
        }).catch(console.error)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-list-item-text {
    overflow: auto;
    white-space: normal
  }

  .md-avatar {
    margin: initial;
  }


</style>
