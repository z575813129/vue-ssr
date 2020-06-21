<template>
  <v-app>
    <v-app-bar app clipped-left color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-text-field solo-inverted flat hide-details label="Search" clearable @keyup.enter="search" v-model="keywords" prepend-inner-icon="search" />
        <span style="width:80px;text-align:right;" >
          <v-badge v-if="isAuth"
            :content="messages"
            :value="messages"
            color="red"
            overlap
            style="margin: 10px;"

          >
            <v-icon mid color="white" @click="$router.push({path:'/my/messages'})" >mdi-email</v-icon>
          </v-badge>
          <v-btn v-else small depressed @click="goLogin" >{{$t('common.login')}}</v-btn>
        </span>

        <!-- <v-avatar>
          <img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          >
        </v-avatar> -->

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-row class="primary" >
        <v-col cols="4" align="center" >
          <v-avatar size="64" style="margin-left:10px;" >
            <img v-if="userInfo.avatar"
              :src="userInfo.avatar"
              alt=""
            >
            <v-icon v-else size="64">mdi-account-circle</v-icon>
          </v-avatar>
        </v-col>
        <v-col style="padding-top:25px;"  >
          <span v-if="isAuth" style="font-size:1.3rem;" >{{userInfo.username}}</span>
          <v-btn v-else depressed width="60%" @click="goLogin" >{{$t('common.login')}}</v-btn>
        </v-col>

      </v-row>
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-right">

            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-4" />
          <v-list-item v-else :key="i" link @click="goTo(item)" >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content style="height: 100vh;overflow: hidden;" >
      <v-container fluid class="grey lighten-4 fill-height" style="padding: 0;" >
        <nuxt :keep-alive="true" :keepAliveProps="{include: ['index','search', ]}" />
        <toast />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Toast from '~/components/Toast.vue'

export default {
  components: {
    Toast
  },
  head: {
    meta: [
      
    ]
  },
  data() {
    return {
      drawer: null,
      // messages: 0,
      keywords: '',
      msgTask: null
    };
  },
  computed: {
    messages() {
      return this.$store.state.msgCount || 0
    },
    userInfo() {
      return this.$store.state.userInfo || {}
    },
    isAuth() {
      return this.$store.state.isAuth
    },
    items() {
      return [
        {id: 1, text: this.$t('links.drawers.index'), url: '/', icon: 'home'},
        {id: 7, text: this.$t('links.drawers.myMessages'), url: '/my/messages', icon: 'notifications'},
        {id: 3, text: this.$t('links.drawers.myCollections'), url: '/my/collections', icon: 'star'},
        {id: 2, text: this.$t('links.drawers.myInfo'), url: '/my/info', icon: 'person'},
        {id: 3, text: this.$t('links.drawers.myPosts'), url: '/my/posts', icon: 'move_to_inbox'},
        {
          id: 5,
          text: this.$t('links.drawers.language') + ': ' + (this.$i18n.locale == 'zh' ? 'English' : '中文'),
          icon: 'language'
        },
        {id: 4, text: this.$t('links.drawers.about'), url: '/about', icon: 'visibility'},
        {id: 6, text: this.$t('links.drawers.logout'), url: '/', icon: 'exit_to_app'},
        // { divider: true },
        // { heading: "Categories" },
        // { icon: "settings", text: "Settings" },
        // { icon: "chat_bubble", text: "Trash" },
        // { icon: "help", text: "Help" },
        // { icon: "phonelink", text: "App downloads" },
        // { icon: "keyboard", text: "Keyboard shortcuts" }
      ]
    }
  },
  mounted() {
    // if (this.isAuth) {
    //   this.fetchCountMyUnreadMessage()
    // } else {
    //   this.messages = 0
    // }
    this.$store.dispatch('fetchMsgCount')
    if (!this.msgTask) {
      this.msgTask = setInterval(()=> {
        this.$store.dispatch('fetchMsgCount')
      }, 10000)
    }
    
  },
  beforeDestroy() {
    console.log('清除定时器')
    clearInterval(this.msgTask)
  },
  methods: {
    goTo(item) {
      this.drawer = false
      switch (item.id) {
        case 5:
          if (this.$i18n.locale == 'zh') {
            this.$i18n.setLocale('en')
            this.$router.push(this.switchLocalePath('en'))
          } else {
            this.$i18n.setLocale('zh')
            this.$router.push(this.switchLocalePath('zh'))
          }
          break
        case 6:
          this.$store.dispatch('logout')
        default:
          this.$router.push(item.url)

      }
    },
    goLogin() {
      this.drawer = false
      // this.$router.push({ path: '/auth/login', query: {redirect: this.$route.fullPath}})
      this.$router.push({ path: '/auth/login'})

    },
    fetchCountMyUnreadMessage() {
    },
    search() {
      this.$router.push({
        path: '/search',
        query: {
          keywords: this.keywords
        }
      })
    }
  }
};
</script>
