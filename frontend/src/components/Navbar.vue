<template>
  <div>
    <v-app-bar color="primary" clipped-left app dark>
      <v-toolbar-title>mimiCopy</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-toolbar-items>
        <v-btn @click.stop="$store.commit('toggleDrawer')" text>AB Loops<v-icon>mdi-repeat</v-icon></v-btn>
      </v-toolbar-items>
      </template>
    </v-app-bar>
  </div>
</template>