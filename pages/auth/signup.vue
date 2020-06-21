<template>
  <v-row id="main" justify="center" align="center">
    <v-col cols="12" sm="8" md="8">
      <h1 id="title" >Sign Up</h1>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              :label="$t('auth.signup.username')"
              name="username"
              prepend-icon="person"
              type="text"
              v-model="form.username"
              :rules="rules.username"
              required
            />
            <v-text-field
              :label="$t('auth.signup.email')"
              name="email"
              prepend-icon="email"
              type="email"
              v-model="form.email"
              :rules="rules.email"
              required
            />
            <v-text-field
              :label="$t('auth.signup.password')"
              name="password"
              prepend-icon="lock"
              type="password"
              v-model="form.password"
              :rules="rules.password"
              required
            />
          </v-form>
        <div>
          <v-btn color="primary" class="btn1" @click="check">{{$t('auth.signup.signup')}}</v-btn>
        </div>
          
        
    </v-col>
  </v-row>
</template>

<script>
const qs = require("querystring");
export default {
  name: "signup",
  layout: "vuetify",
  meta: {
    requireAuth: false
  },
  data: () => ({
    form: {
      username: "",
      password: "",
      email: ""
    },
    rules: {
      username: [
        v => !!v || "Username is required",
        v => v.length >= 3 || "Username must be more than 3",
        v => v.length <= 20 || "Username must be less than 20"
      ],
      email: [v => !!v || "Email is required"],
      password: [v => !!v || "Password is required"]
    },
    valid: true
  }),
  head() {
    return {
      title: this.$t("auth.signup.title")
    };
  },
  async asyncData({ $axios }) {
  },
  methods: {
    check() {
      if (this.$refs["form"].validate()) {
        this.register();
      }
    },
    register() {
      this.$axios
        .post("/api/v2/auth/register", {
          // username: this.username,
          // password: this.password,
          // email: this.email
          ...this.form
        })
        .then(({ data }) => {
          
          this.$store.dispatch("login", { accessToken: data.accessToken });
          if (this.$route.query && this.$route.query.redirect) {
            this.$router.replace(this.$route.query.redirect);
          } else {
            this.$router.replace("/");
          }
        })
        .catch(err => {});
    }
  }
};
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
