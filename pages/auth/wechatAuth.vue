<template>
  <v-row align="center" justify="center" id="main" >
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <div v-if="mode == 1" >
        <h3 id="title" >{{$t('auth.wechatAuth.signupTitle')}}</h3>
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
          <v-btn color="primary" class="btn1" :loading="isSignup"  @click="signup">{{$t('auth.wechatAuth.signupBtn')}}</v-btn>
          <v-btn class="btn1" @click="()=> this.mode=2">{{$t('auth.wechatAuth.goToBind')}}</v-btn>
        </div>
      </div>
      <div v-if="mode == 2" >
        <h3 id="title" >{{$t('auth.wechatAuth.bindTitle')}}</h3>
        <v-form ref="form2" v-model="valid2" lazy-validation>
          <v-text-field
            :label="$t('auth.wechatAuth.account')"
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
          <v-btn color="primary" class="btn1" :loading="isBinding"  @click="binding">{{$t('auth.wechatAuth.bindBtn')}}</v-btn>
          <v-btn class="btn1" @click="()=> this.mode=1">{{$t('auth.wechatAuth.goToSignup')}}</v-btn>
        </div>
      </div>
      <!-- <h1 id="title" >Sign Up</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.googleAuth.email')"
          name="email"
          prepend-icon="person"
          type="email"
          v-model="data.email"
          disabled
        />
        <v-text-field
          :label="$t('auth.googleAuth.username')"
          name="username"
          prepend-icon="person"
          type="text"
          v-model="form.username"
          :rules="rules.username"
          required
        />
        <v-text-field
          :label="$t('auth.googleAuth.password')"
          name="password"
          prepend-icon="lock"
          type="password"
          v-model="form.password"
          :rules="rules.password"
          required
        />
      </v-form>
      <div>
        <v-btn color="primary" class="btn1"  @click="check">{{$t('auth.googleAuth.register')}}</v-btn>
      </div> -->
    </v-col>
  </v-row>
</template>

<script>
const qs = require('querystring')

export default {
  name: 'wechatAuth',
  layout: 'vuetify',
  meta: {
    requireAuth: false
  },
  data() {
    return {
      code: '',
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
      isBinding: false
    }
  },
  head () {
    return {
      title: 'BAAC - Wechat Auth'
    }
  },
  mounted() {
    // console.log(hashes)
    const { code, state } = this.$route.query
    this.code = code
    const states = qs.parse(state)
    if (states.redirect) this.redirect = states.redirect
    this.init()
 
  },
  methods: {
    async init() {
      try {
        const {data} = await this.$axios.post('/api/v2/auth/authByWx', { wxCode:this.code })
        
        const { accessToken, result, openid } = data
        if (result == 1) { // 未注册
          this.openid=openid
          this.mode = 1
        } else {
          this.$store.dispatch('login', {accessToken: accessToken})
          this.goRedirect()
        }
        
      } catch(e) {
        // console.error(e)
      }

    },
    check() {
      if(this.$refs['form'].validate()) {
        this.register()
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
      this.$axios.post('/api/v2/auth/signupByWx', {
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
      this.$axios.post('/api/v2/auth/bindingWx', {
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
