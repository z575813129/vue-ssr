<template>
  <v-row align="center" justify="center" id="main" >
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <div v-if="mode == 1" >
        <h3 id="title" >{{$t('auth.facebookAuth.signupTitle')}}</h3>
        <v-form ref="form1" v-model="valid1" lazy-validation>
          <v-text-field
            :label="$t('common.email')"
            name="email"
            prepend-icon="email"
            type="email"
            v-model="signupForm.email"
            :rules="rules.email"
            required
          />
          <v-text-field
            :label="$t('common.username')"
            name="username"
            prepend-icon="person"
            type="text"
            v-model="signupForm.username"
            :rules="rules.username"
            required
          />
          <v-text-field
            :label="$t('common.password')"
            name="password"
            prepend-icon="lock"
            type="password"
            v-model="signupForm.password"
            :rules="rules.password"
            required
          />
        </v-form>
        <div>
          <v-btn color="primary" class="btn1" :loading="isSignup"  @click="signup">{{$t('auth.facebookAuth.signupBtn')}}</v-btn>
          <v-btn class="btn1" @click="()=> this.mode=2">{{$t('auth.facebookAuth.goToBind')}}</v-btn>
        </div>
      </div>
      <div v-if="mode == 2" >
        <h3 id="title" >{{$t('auth.facebookAuth.bindTitle')}}</h3>
        <v-form ref="form2" v-model="valid2" lazy-validation>
          <v-text-field
            :label="$t('auth.facebookAuth.account')"
            name="account"
            prepend-icon="person"
            type="text"
            v-model="bindingForm.account"
            :rules="rules.account"
            required
          />
          <v-text-field
            :label="$t('common.password')"
            name="password"
            prepend-icon="lock"
            type="password"
            v-model="bindingForm.password"
            :rules="rules.password"
            required
          />
        </v-form>
        <div>
          <v-btn color="primary" class="btn1" :loading="isBinding"  @click="binding">{{$t('auth.facebookAuth.bindBtn')}}</v-btn>
          <v-btn class="btn1" @click="()=> this.mode=1">{{$t('auth.facebookAuth.goToSignup')}}</v-btn>
        </div>
      </div>
      <div v-if="mode==3" >
        <h3 class="error--text" >ERROR: {{error||'Facebook Auth Fail!'}}</h3>
      </div>
    </v-col>
  </v-row>
</template>

<script>
const qs = require('querystring')

export default {
  name: 'facebookAuth',
  layout: 'vuetify',
  meta: {
    requireAuth: false,
    keepAlive: false
  },
  data() {
    return {
      data: {},
      openid: '',
      redirect: '/',
      mode: 0,
      signupForm: {
        username: '',
        email: '',
        password: ''
      },
      rules: {
        username: [
          v => !!v || "Username is required",
          v => v.length >= 3 || "Username must be greater than 3",
          v => v.length <= 20 || "Username must be greater than 20"
        ],
        email: [v => !!v || "Email is required"],
        password: [v => !!v || "Password is required"],
        account: [v => !!v || "Account is required"],
      },
      bindingForm: {
        account: '',
        password: ''
      },
      valid1: true,
      valid2: true,
      isSignup: false,
      isBinding: false,
      error: null
    }
  },
  head () {
    return {
      title: 'BAAC - Facebook Auth'
    }
  },
  mounted() {
    // this.redirect = this.$route.query.redirect
    // console.log('Facebook 授权登录中')
    // setTimeout(() => {
    //   this.fbAuth()
    // },1000)
    const { error } = this.$route.query
    if (error) {
      this.mode = 3
      this.error = error
      return
    }
    const hashes = qs.parse(this.$route.hash.substring(1))
    // console.log(hashes)
    const { access_token, state } = hashes
    this.token = access_token
    const states = qs.parse(state)
    if (states.redirect) this.redirect = states.redirect
    this.init()
  },
  methods: {
    async init() {
      try {
        const { data } = await this.$axios.get('https://graph.facebook.com/v5.0/me?access_token='+this.token)
        this.data = data
        this.openid = data.id
        console.log(data)
        const {data:data2} = await this.$axios.post('/api/v2/auth/authByFb', { openid: this.openid})
        const { accessToken, result, openid } = data2
        if (result == 1) { // 未注册
          // this.openid=openid
          this.mode = 1
        } else {
          this.$store.dispatch('login', {accessToken: accessToken})
          this.goRedirect()
        }
      } catch(e) {
        console.error(e)
      }
    },
    goRedirect() {
      if (this.redirect) {
        this.$router.replace(this.redirect);
      } else {
        this.$router.replace("/");
      }
    },
    signup() {
      if (!this.$refs['form1'].validate())
        return
      this.isSignup = true
      this.$axios.post('/api/v2/auth/signupByFb', {
        openid: this.openid,
        ...this.signupForm
      }).then(({data}) => {
        const { accessToken } = data
        this.$store.commit("SHOW_TOAST", { show: true, content: 'Success!' })
        this.$store.dispatch('login', {accessToken: accessToken})

        this.goRedirect()
      }).catch(err => {
        
      }).finally(() => {
        this.isSignup = false
      })
    },
    binding() {
      if (!this.$refs['form2'].validate())
        return
      this.isBinding = true
      this.$axios.post('/api/v2/auth/bindFb', {
        openid: this.openid,
        ...this.bindingForm
      }).then(({data}) => {
        const { accessToken } = data
        this.$store.commit("SHOW_TOAST", { show: true, content: 'Success!' })
        this.$store.dispatch('login', {accessToken: accessToken})

        this.goRedirect()
      }).catch(err => {
        
      }).finally(() => {
        this.isBinding = false
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

</style>
