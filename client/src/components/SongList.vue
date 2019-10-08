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
          <vue-dropzone
            @vdropzone-file-added="vFileAdded"
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
          ></vue-dropzone>
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
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  data: function() {
    return {
      dropzoneOptions: {
        url: "/",
        method: "post",
        acceptedFiles: "audio/*",
        thumbnailWidth: 100,
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i>Upload songs",
        addRemoveLinks: "true",
        chunking: true,
        forceChunking: true,
        autoQueue: false,
        autoProcessQueue: false
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
    },
    vFileAdded: function(file) {
      let self = this;
      this.storageUpload(file, function(res) {
        // add file path to db
        console.log(res);
        let db = firebase.firestore();
        let usersRef = db.collection("users");
        var userRef = usersRef.doc(self.$store.getters.user.uid);
        userRef.set(
          {
            songs: res
          },
          { merge: true }
        );
      });
    },
    storageUpload: function(file, cb) {
      var progressBar = file.previewElement.querySelectorAll(
        "[data-dz-uploadprogress]"
      )[0];
      progressBar.opacity = 1;
      let uuid = file.upload.uuid;
      let userUid = this.$store.getters.user.uid;

      let storageRef = firebase.storage().ref();
      let extension = file.name.split(".")[1];
      let filePath = storageRef.child(`${userUid}/${uuid}.${extension}`);
      let task = filePath.put(file);

      task.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        function(snapshot) {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressBar.style.width = progress + "%";
        },
        function(error) {},
        function() {
          task.snapshot.ref.getMetadata().then(function(meta) {
            var response = {
              path: meta.fullPath,
              timeCreated: meta.timeCreated
            };
            return cb(response);
          });
        }
      );
    }
  }
};
</script>

<style>
</style>