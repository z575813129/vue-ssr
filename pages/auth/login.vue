<template>
  <v-row align="center" justify="center" id="main">
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <h1 id="title" >B A A C</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.login.username')"
          name="username"
          prepend-icon="person"
          type="text"
          v-model="form.username"
          :rules="rules.username"
          required
        />
        <v-text-field
          label="Password"
          name="password"
          prepend-icon="lock"
          type="password"
          v-model="form.password"
          :rules="rules.password"
          required
        />
      </v-form>
      <div>
        <nuxt-link class="link link-left" to="/auth/signup" >{{$t('auth.login.register')}}</nuxt-link>
        <nuxt-link class="link link-right" to="/auth/forgetPassword">{{$t('auth.login.forgetPassword')}}</nuxt-link>
      </div>
      <div>

        <v-btn color="primary" class="btn1"  @click="check">{{$t('auth.login.login')}}</v-btn>
        <v-btn class="btn1" @click="authByGoogle">{{$t('auth.login.googleAuth')}}</v-btn>
        <v-btn class="btn1" @click="authByWx">{{$t('auth.login.wechatAuth')}}</v-btn>
        <v-btn class="btn1" @click="authByFB">{{$t('auth.login.facebookAuth')}}</v-btn>
        <!-- <fb:login-button 
          scope="public_profile,email"
          onlogin="authByFB();">
        </fb:login-button> -->
      </div>
    </v-col>
  </v-row>
  
</template>

<script>
const qs = require("querystring");
export default {
  name: "login",
  layout: 'vuetify',
  meta: {
    requireAuth: false
  },
  data(){
    return {
      username: "",
      password: "",
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          v => !!v || this.$t("auth.login.accountEmpty"),
        ],
        password: [
          v => !!v || this.$t("auth.login.passwordEmpty")
        ]
      },
      valid: true
      // accessToken: ''
    }
  },
  head() {
    return {
      title: this.$t("auth.login.title")
    };
  },
  async asyncData({ $axios }) {
  },
  mounted() {
    
  },
  methods: {
    check() {
      if(this.$refs['form'].validate()) {
        this.login()
      }
    },
    async login() {
      const {
        data
      } = await this.$axios.post("/api/v2/auth/loginByPassword", {
        ...this.form
      });
      
      await this.$store.dispatch("login", { accessToken: data.accessToken });

      if (this.$route.query && this.$route.query.redirect) {
        this.$router.replace(this.$route.query.redirect);
      } else {
        this.$router.replace("/");
      }
      
    },
    authByGoogle() {
      // console.log(this)
      // console.log(this.$cookies)
      console.log("开始google授权登录");
      // const client_id = '338534915323-6lookokopulsv69viqgmlk9bctapvq74.apps.googleusercontent.com'
      // const response_type = 'code'
      // const scope = 'openid email'
      // const redirect_uri = location.href
      // const state = 'maox'
      const queries = {
        client_id:
          "338534915323-6lookokopulsv69viqgmlk9bctapvq74.apps.googleusercontent.com",
        response_type: "token",
        scope: "openid profile email",
        // scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        // redirect_uri: location.href,
        redirect_uri: location.origin + "/auth/googleAuth",
        state: qs.stringify({ redirect: this.$route.query.redirect })
        // nonce: '0394852-3190485-2490358'
      };
      // console.log(location)
      // console.log(this.$route)
      const url =
        `https://accounts.google.com/o/oauth2/auth?` + qs.stringify(queries);
      // console.log(url)
      location.href = url;
    },
    authByWx() {
      console.log('开始微信授权登录')

      const queries = {
        appid: 'wx257307660ff63008',
        redirect_uri: location.origin +'/auth/wechatAuth',
        response_type: 'code',
        scope: 'snsapi_base',
        state: qs.stringify({ redirect: this.$route.query.redirect }),

      }

      const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?'+qs.stringify(queries)+'#wechat_redirect'
      console.log(url)
      location.href = url
    },
    authByFB() {
      // this.$router.push({
      //   path: '/auth/facebookAuth',
      //   query: {
      //     ...this.$route.query
      //   }
      // })
      const queries = {
        client_id: '556744894901834',
        redirect_uri: location.origin +'/auth/facebookAuth',
        response_type: 'token',
        state: qs.stringify({ redirect: this.$route.query.redirect }),
      }
      const url = `https://www.facebook.com/v5.0/dialog/oauth?` + qs.stringify(queries)
      location.href = url
    }
  }
};
</script>

<style lang="scss" scoped>
#main {
  width: 100%;
  text-align: center;
  padding-bottom: 10%;
  margin-left: 5%;
  margin-right: 5%;
}
#title {
  color: teal;
  margin-bottom: 20%;
}
.btn1 {
  width: 100%;
  margin-top: 5%;
}
.link {
  text-decoration: underline;
}
.link-left {
  float: left;
  margin-left: 10px;
}
.link-right {
  float: right;
  margin-right: 10px;
}
</style>
