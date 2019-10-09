<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <validation-provider name="Email" rules="required|email">
                  <div slot-scope="{ errors }">
                    <v-text-field v-model="email" label="Email" name="Email" type="text"></v-text-field>
                    <span>{{ errors[0] }}</span>
                  </div>
                </validation-provider>
                <validation-provider name="password" rules="required|max:15">
                  <div slot-scope="{ errors }">
                    <v-text-field
                      v-model="password"
                      label="Password"
                      name="Password"
                      type="password"
                    ></v-text-field>
                    <span>{{ errors[1] }}</span>
                  </div>
                </validation-provider>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>

              <v-btn @click="login" color="primary">Login</v-btn>
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
      password: ""
    };
  },
  methods: {
    login: function() {
      Firebase.login(this.email, this.password);
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
.auth-btn {
  cursor: pointer;
}
</style>