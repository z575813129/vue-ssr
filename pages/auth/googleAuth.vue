<template>
  <v-row align="center" justify="center" id="main" v-if="registerMode" >
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <h1 id="title" >Sign Up</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.googleAuth.email')"
          name="email"
          prepend-icon="email"
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
      </div>
    </v-col>
  </v-row>
</template>

<script>
const qs = require('querystring')

export default {
  name: 'GoogleAuth',
  layout: 'vuetify',
  meta: {
    requireAuth: false
  },
  data() {
    return {
      token: '',
      data: {},
      redirect: '/',
      registerMode: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          v => !!v || "Username is required",
          v => v.length >= 3 || "Username must be greater than 3",
          v => v.length <= 20 || "Username must be greater than 20"
        ],
        password: [v => !!v || "Password is required"]
      },
      valid: true
    }
  },
  head () {
    return {
      title: 'BAAC'
    }
  },
  mounted() {
    // console.log(this.$route)
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
        const { data } = await this.$axios.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token='+this.token)
        this.data = data
        // console.log(data)
        const {data: data2} = await this.$axios.post('/api/v2/auth/loginByGoogle', { token:this.token, data: this.data })
        
        if (data2.result == 0) {
          // 登录成功
          const { accessToken } = data2
          await this.$store.dispatch('login', {accessToken: accessToken})

          this.goRedirect()
        } else {
          // 用户不存在，开始注册
          this.registerMode=true
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
    async register() {
      try {
        const {data} = await this.$axios.post('/api/v2/auth/registerByGoogle', {
          token:this.token,
          data: this.data,
          ...this.form
        })
          
        await this.$store.dispatch('login', {accessToken: data.accessToken})
        this.goRedirect()
      } catch(e) {
        // console.error(e)
      }

    },
    goRedirect() {
      if (this.redirect) {
        this.$router.replace(this.redirect);
      } else {
        this.$router.replace("/");
      }
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
