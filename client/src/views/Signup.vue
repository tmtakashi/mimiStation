<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Sign Up</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-form @submit.prevent="signup">
              <v-card-text>
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="Email"
                  type="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  name="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn type="submit" color="success">Register</v-btn>
                <br />
                <div class="ml-5">
                  or
                  <img
                    class="auth-btn"
                    src="../assets/img/btn_google_signin_dark_normal_web@2x.png"
                    width="175"
                    @click="loginWithGoogle"
                  />
                </div>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Firebase from "../firebase";
import router from "../router";
import { ValidationProvider, extend } from "vee-validate";
import { required, email, max } from "vee-validate/dist/rules";

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
    signup: async function() {
      var res = await Firebase.signup(this.email, this.password);
      if (res) {
        var db = Firebase.db();
        db.collection("users")
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
      }
    },
    loginWithGoogle: async function() {
      var res = await Firebase.loginWithGoogle();
      var db = Firebase.db();
      db.collection("users")
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
    }
  }
};
</script>

<style>
</style>