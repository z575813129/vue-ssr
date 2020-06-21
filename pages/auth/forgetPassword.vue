<template>
  <v-row align="center" justify="center" id="main">
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <h3 id="title" >{{$t('auth.forgetPassword.title')}}</h3>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :label="$t('auth.forgetPassword.email')"
          name="email"
          prepend-icon="email"
          type="email"
          v-model="email"
          :rules="emailRule"
          required
        />
      </v-form>
      <div>
        <v-btn color="primary" class="btn1" :disabled="isSended"  @click="check">{{$t('auth.forgetPassword.send')}}</v-btn>
        <p v-if="isSended" id="successTips" >{{$t('auth.forgetPassword.sendTips')}}</p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'forgetPassword',
  layout: 'vuetify',
  meta: {
    requireAuth: false
  },
  data: () => {
    return {
      email: '',
      emailRule: [
        v => !!v || 'Email is required'
      ],
      isSended: false,
      valid: false
    }
  },
  head () {
    return {
      title: this.$t('auth.forgetPassword.title')
    }
  },
  methods: {
    check() {
      if(this.$refs['form'].validate()) {
        this.sendEmail()
      }
    },
    async sendEmail() {
      try {
        const { data: { code, data, msg }} = await this.$axios.post('/api/v2/auth/sendResetPasswordEmail', { email: this.email })

        
        this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('auth.forgetPassword.sendTips')})
        this.isSended=true
      } catch (err) {
        // this.$store.commit('SHOW_TOAST', {show: true, content: err})
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
#successTips {
  text-align: left;
  margin: 5px;
  color: teal;
}
</style>
