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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="song in songList" v-bind:key="song.id">
                <td>{{ song.artist }}</td>
                <td>{{ song.name }}</td>
                <td></td>
              </tr>
              <tr v-for="(form, idx) in uploadForm" v-bind:key="idx">
                <td>
                  <v-text-field single-line label="Type artist name" v-model="form.artist"></v-text-field>
                </td>
                <td>
                  <v-text-field single-line label="Type song name" v-model="form.name"></v-text-field>
                </td>
                <td>
                  <v-btn color="success" @click="handleUpload(idx)">upload</v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <vue-dropzone
            @vdropzone-file-added="vFileAdded"
            ref="dropzone"
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
  created() {
    var db = firebase.firestore();
    var self = this;
    let songs;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let usersRef = db.collection("users").doc(user.uid);
        usersRef.get().then(function(doc) {
          songs = doc.data().songs;
          self.songList = songs;
        });
      } else {
        // No user is signed in.
      }
    });
  },
  data: function() {
    return {
      dropzoneOptions: {
        url: "/",
        method: "post",
        acceptedFiles: "audio/*",
        thumbnailWidth: 60,
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i>Upload songs",
        addRemoveLinks: "true",
        chunking: true,
        forceChunking: true,
        autoQueue: false,
        autoProcessQueue: false
      },
      songList: [],
      uploadForm: []
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
    vFileAdded: function(file) {
      this.uploadForm.push({
        artist: "",
        name: "",
        file: file
      });
    },
    async handleUpload(idx) {
      let self = this;
      let file = this.uploadForm[idx].file;
      let artist = this.uploadForm[idx].artist;
      let name = this.uploadForm[idx].name;
      await this.storageUpload(file, function(res) {
        res.artist = artist;
        res.name = name;
        // add file path to db
        let db = firebase.firestore();
        let usersRef = db.collection("users");
        var userRef = usersRef.doc(self.$store.getters.user.uid);
        userRef
          .update({
            songs: firebase.firestore.FieldValue.arrayUnion(res)
          })
          .then(function() {
            self.songList.push({
              artist: artist,
              name: name
            });
            self.uploadForm.splice(idx, 1);
          });
        self.$refs.dropzone.removeAllFiles();
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