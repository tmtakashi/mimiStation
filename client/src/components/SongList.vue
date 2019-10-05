<template>
  <v-row justify="center">
    <v-dialog v-model="show" scrollable max-width="600px">
      <v-card>
        <v-card-title>Select a Song</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th>Artist</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fuga</td>
                <td>Hoge</td>
              </tr>
            </tbody>
          </v-simple-table>
          <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click.stop="show=false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  data: function() {
    return {
      dropzoneOptions: {
        url: `http://localhost:8888/upload_songs`,
        method: "post",
        acceptedFiles: "audio/*",
        thumbnailWidth: 100,
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i>Upload songs",
        addRemoveLinks: "true"
      }
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  props: ["visible"],
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    }
  },
  methods: {
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log("response", newFile.response);
        if (newFile.xhr) {
          //  Get the response status code
          console.log("status", newFile.xhr.status);
        }
      }
    },
    inputFilter: function(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    }
  }
};
</script>

<style>
</style>