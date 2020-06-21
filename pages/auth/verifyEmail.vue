<template>
  <v-row align="center" justify="center" id="main">
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <h3 id="title" >Verify Email</h3>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.verifyEmail.username')"
          name="email"
          prepend-icon="person"
          type="text"
          v-model="username"
          disabled=""
        />
      </v-form>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.verifyEmail.email')"
          name="email"
          prepend-icon="email"
          type="email"
          v-model="email"
          disabled
        />
      </v-form>
      <div>
        <v-btn class="btn1" @click="ignore">{{$t('auth.verifyEmail.ignoreBtn')}}</v-btn>
        <v-btn color="primary" class="btn1" :disabled="isSended" :loading="loading"  @click="sendVerifyEmail">{{$t('auth.verifyEmail.sendBtn')}}</v-btn>
        <p v-if="isSended" id="successTips" >{{$t('auth.forgetPassword.sendTips')}}</p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  const qs = require('querystring')
  export default {
    name: "verifyEmail",
    layout: 'vuetify',
    meta: {
      requireAuth: true
    },
    data: () => ({
      valid: true,
      isSended: false,
      loading: false
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
      this.$store.dispatch('userInfo').then(() => {
        if (this.isEmailVerify == 1) {
          this.goRedirect()
        }
      })

    },
    methods: {
      goRedirect() {
        if (this.$route.query && this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        } else {
          this.$router.replace("/");
        }
      },
      ignore() {
        this.$store.commit('ignoreEmailVerify')
        if (this.$route.query && this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        } else {
          this.$router.replace("/");
        }
      },
      sendVerifyEmail() {
        this.loading = true
        this.$axios
          .post('/api/v2/auth/sendVerifyEmail', {})
          .then(({data}) => {
            if (data.result == 2) {
              this.$store.commit('SHOW_TOAST', {show: true, content: 'Your email is verified' })
              this.goRedirect()
            } else {
              this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('auth.forgetPassword.sendTips') })
              this.isSended = true
            }
            
          })
          .catch(err=> {})
          .finally(() => {
            this.loading = false
          })
      },
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
