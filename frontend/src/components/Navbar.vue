<template>
  <div>
    <v-app-bar color="primary" clipped-left app dark>
      <v-toolbar-title>mimiCopy</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-btn icon>
          <v-icon>mdi-export-variant</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-delete-circle</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>