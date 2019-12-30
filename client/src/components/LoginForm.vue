<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login</v-toolbar-title>
      <div class="flex-grow-1"></div>
    </v-toolbar>
    <v-form @submit.prevent="login">
      <v-card-text>
        <v-text-field
          v-model="email"
          label="Email"
          name="Email"
          type="email"
          :rules="emailRules"
          required
        ></v-text-field>
        <v-text-field v-model="password" label="Password" name="Password" type="password" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn type="submit" color="primary">Login</v-btn>
        <div class="ml-5">
          or
          <img
            class="auth-btn"
            src="../assets/img/btn_google_signin_dark_normal_web@2x.png"
            width="175"
            v-on:click="loginWithGoogle"
          />
        </div>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Firebase from "./../firebase";
import { ValidationProvider, extend } from "vee-validate";
import { required, email, max } from "vee-validate/dist/rules";
import router from "../router";

extend("required", {
  ...required,
  message: "The {_field_} field is required"
});
extend("email", email);
extend("max", max);
export default {
  components: {
    ValidationProvider
  },
  data: function() {
    return {
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      password: ""
    };
  },
  methods: {
    login: async function() {
      var res = await Firebase.login(this.email, this.password);
      if (res) {
        this.createUserInDB(res);
      }
    },
    loginWithGoogle: async function() {
      var res = await Firebase.loginWithGoogle();
      this.createUserInDB(res);
    },
    createUserInDB: function(res) {
      var db = Firebase.db();
      var users = db.collection("users");
      users
        .where("uid", "==", res.user.uid)
        .get()
        .then(function(querysnapshot) {
          if (querysnapshot.length == 0) {
            users
              .doc(res.user.uid)
              .set({
                email: res.user.email,
                songs: []
              })
              .then(function(docRef) {
                router.push("/");
              })
              .catch(function(error) {
                console.error("Error adding document: ", error);
              });
          } else {
            router.push("/");
          }
        });
    }
  }
};
</script>

<style scoped>
.auth-btn {
  cursor: pointer;
}
</style>