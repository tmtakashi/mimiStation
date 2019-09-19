<template>
  <v-app>
    <Navbar></Navbar>
    <Player></Player>
  </v-app>
</template>

<script>
import Player from './components/Player.vue'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Player
  }
}
</script>

<style>

</style>
