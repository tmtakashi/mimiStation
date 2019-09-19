<template>
    <div>
      <v-toolbar color="primary" dark>
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
        </v-toolbar>
    </div>
</template>