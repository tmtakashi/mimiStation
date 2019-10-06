<template>
  <div>
    <!-- <validation-provider rules="required" v-slot="{ errors }"> -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Sign Up</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field v-model="email" label="Email" name="login" type="text"></v-text-field>

                <v-text-field
                  v-model="password"
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn @click="signup" color="success">Register</v-btn>
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- </validation-provider> -->
  </div>
</template>

<script>
import { ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import Firebase from "../firebase";

extend("required", {
  ...required,
  message: "The {_field_} field is required"
});
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
    signup: function() {
      Firebase.signup(this.email, this.password);
    },
    loginWithGoogle: function() {
      Firebase.loginWithGoogle();
    }
  }
};
</script>

<style>
</style>