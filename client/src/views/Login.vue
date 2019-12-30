<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <LoginForm :onlogin="handleLogin"></LoginForm>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoginForm from "@/components/molecules/LoginForm.vue";
export default {
  components: {
    LoginForm
  },
  methods: {
    handleLogin(authInfo) {
      return this.$store
        .dispatch("login", authInfo)
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => this.throwReject(err));
    },
    throwReject(err) {
      return Promise.reject(err);
    }
  }
};
</script>
