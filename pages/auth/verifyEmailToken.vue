<template>
  <v-row align="center" justify="center" id="main">
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <h2 v-if="isError" class="error--text" >Error: {{errMsg}}</h2>
    </v-col>
  </v-row>
</template>

<script>
  const qs = require('querystring')
  export default {
    name: "verifyEmailToken",
    layout: 'vuetify',
    meta: {
      requireAuth: false
    },
    data: () => ({
      token: '',
      isError: false,
      errMsg: ''
    }),
    head () {
      return {
        title: this.$t('auth.verifyEmail.title')
      }
    },
    computed: {
      email() {
        return this.$store.state.userInfo.email
      },
      username() {
        return this.$store.state.userInfo.username
      },
      isEmailVerify() {
        return this.$store.state.userInfo.isEmailVerify
      }
    },
    async asyncData({ $axios }) {
    },
    mounted() {
      this.token = this.$route.query.token
      this.verify()
    },
    methods: {
      verify() {
        this.$axios
          .post('/api/v2/auth/resolveVerifyEmailToken', { token: this.token })
          .then(({data}) => {
            
            this.$store.commit('SHOW_TOAST', {show: true, content: 'Success!'})
            this.$router.replace('/')
          
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
#main {
  width: 100%;
  text-align: center;
  padding-bottom: 30%;
  margin-left: 5%;
  margin-right: 5%;
}
#title {
  color: teal;
  margin-bottom: 20%;
}
.btn1 {
  width: 100%;
  margin-top: 10%;
}
#successTips {
  text-align: left;
  margin: 5px;
  color: teal;
}
</style>
