<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <LoginForm></LoginForm>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
export default {
  components: {
    LoginForm
  }
};
</script>
