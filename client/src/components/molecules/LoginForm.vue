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
        <v-btn
          type="submit"
          color="primary"
          @click="handleClick"
          :disabled="disableLoginAction"
        >Login</v-btn>
        <div class="ml-5">
          or
          <img
            class="auth-btn"
            src="@/assets/img/btn_google_signin_dark_normal_web@2x.png"
            width="175"
            v-on:click="loginWithGoogle"
          />
        </div>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Firebase from "@/firebase";
import router from "@/router";

// regular expression for email validation
const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// function checks if the value is empty
const required = val => !!val.trim();

export default {
  props: {
    onlogin: {
      type: Function,
      required: true
    }
  },
  data: function() {
    return {
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      password: "",
      progress: false,
      error: ""
    };
  },
  computed: {
    validation() {
      return {
        email: {
          required: required(this.email),
          format: REGEX_EMAIL.test(this.email)
        },
        password: {
          required: required(this.password)
        }
      };
    },
    valid() {
      const validation = this.validation;
      const fields = Object.keys(validation);
      let valid = true;
      // check if all fields are valid
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        valid = Object.keys(validation[field]).every(
          key => validation[field][key]
        );
        if (!valid) {
          break;
        }
      }
      return valid;
    }
  },
  disableLoginAction() {
    return !this.valid || this.progress;
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
    },
    handleClick(e) {
      if (this.disableLoginAction) {
        return;
      }

      this.progress = true;
      this.error = "";

      this.$nextTick(() => {
        this.onlogin({ email: this.email, password: this.password })
          .catch(err => {
            this.error = err.message;
          })
          .then(() => {
            this.progress = false;
          });
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