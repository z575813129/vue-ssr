<template>
  <v-row align="center" justify="center" id="main">
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <h1 id="title" >Reset Password</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.resetPassword.username')"
          name="username"
          prepend-icon="person"
          type="text"
          v-model="username"
          disabled
        />
        <v-text-field
          :label="$t('auth.resetPassword.email')"
          name="email"
          prepend-icon="email"
          type="email"
          v-model="email"
          disabled
        />
        <v-text-field
          :label="$t('auth.resetPassword.newPassword')"
          name="password"
          prepend-icon="lock"
          type="password"
          v-model="form.password"
          :rules="rules.password"
          required
        />
      </v-form>
      <div>
        <v-btn color="primary" class="btn1"  @click="check">{{$t('auth.resetPassword.sendBtn')}}</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  const qs = require('querystring')
  export default {
    name: "resetPassword",
    layout: 'vuetify',
    meta: {
      requireAuth: false
    },
    data: () => ({
      username: '',
      email: '',
      token: '',
      form: {
        password: "",
      },
      rules: {
        password: [v => !!v || "Password is required"]
      },
      valid: true
    }),
    head () {
      return {
        title: this.$t('auth.resetPassword.title')
      }
    },
    async asyncData({ $axios }) {
    },
    mounted() {
      this.token = this.$route.query.token
      this.$axios.post('/api/v2/auth/resolveResetPasswordToken', {
        token: this.token
      }).then(({ data }) => {
        
        this.username = data.username
        this.email = data.email
        
      }).catch(err=> {})
    },
    methods: {
      check() {
        if(this.$refs['form'].validate()) {
          this.resetPassword()
        }
      },
      async resetPassword() {
        const { data } = await this.$axios.post('/api/v2/auth/resetPasswordByToken', {
          token: this.token,
          ...this.form
        })
        
        this.$router.replace('/auth/login')
        
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
