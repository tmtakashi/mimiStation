<template>
  <v-row justify="center">
    <v-dialog v-model="show" :persistent="!songSelected" scrollable max-width="600px">
      <v-card>
        <v-card-title>Select a Song</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr v-if="songList.length != 0 || uploadForm.length != 0">
                <th>Artist</th>
                <th>Title</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr class="song" v-for="(song, idx) in songList" v-bind:key="`first-${idx}`">
                <td class="artist" @input="syncArtist(idx, $event)">{{ song.artist }}</td>
                <td class="name" @input="syncName(idx, $event)">{{ song.name }}</td>
                <td>
                  <v-icon class="icon" @click="handleDelete(idx, $event)">mdi-delete</v-icon>
                </td>
                <td>
                  <v-icon class="icon" @click="handleEdit(idx, $event)">mdi-pencil-outline</v-icon>
                </td>
                <td>
                  <v-btn @click="changeSong(idx)">select</v-btn>
                </td>
              </tr>
              <tr v-for="(form, idx) in uploadForm" v-bind:key="`second-${idx}`">
                <td>
                  <v-text-field single-line label="Type artist name" v-model="form.artist"></v-text-field>
                </td>
                <td>
                  <v-text-field single-line label="Type song name" v-model="form.name"></v-text-field>
                </td>
                <td>
                  <v-btn color="success" @click="handleUpload(idx)">upload</v-btn>
                </td>
                <td>
                  <v-btn color="red" @click="cancelUpload(idx)" dark>cancel</v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <vue-dropzone
            class="mt-5"
            @vdropzone-file-added="vFileAdded"
            ref="dropzone"
            id="dropzone"
            :options="dropzoneOptions"
          ></vue-dropzone>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="songSelected">
          <v-btn color="blue darken-1" text @click.stop="show=false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import vue2Dropzone from "vue2-dropzone";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import _ from "underscore";

export default {
  beforeCreate() {
    this.$store.commit("toggleLoading", true);
  },
  created() {
    var db = firebase.firestore();
    var self = this;
    let songs;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let usersRef = db.collection("users").doc(user.uid);
        usersRef.get().then(function(doc) {
          songs = doc.data().songs;
          self.songList = songs.sort(function(a, b) {
            return new Date(b.timeCreated) - new Date(a.timeCreated); // newer song on the top
          });
        });
      } else {
        // No user is signed in.
      }
    });
    this.$store.commit("toggleLoading", false);
  },
  beforeMount() {
    this.$store.commit("toggleSongList", true);
  },
  data: function() {
    return {
      dropzoneOptions: {
        url: "/",
        method: "post",
        acceptedFiles: "audio/wav, audio/mp3",
        thumbnailWidth: 60,
        addRemoveLinks: true,
        dictDefaultMessage: "Upload songs (only .wav and .mp3 is supported)",
        chunking: true,
        forceChunking: true,
        autoQueue: false,
        autoProcessQueue: false
      },
      songList: [],
      songListEdit: [],
      uploadForm: []
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  watch: {
    songList: function(val) {
      this.$emit("changeSongList", this.songList);
    }
  },
  props: ["visible"],
  computed: {
    show: {
      get(event) {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
    uploadDefaultMessage: {
      get() {
        return document.getElementsByClassName("dz-default dz-message")[0];
      }
    },
    ...mapGetters(["songSelected"])
  },
  methods: {
    vFileAdded: function(file) {
      this.uploadForm.push({
        artist: "",
        name: "",
        file: file
      });
      this.$store.commit("changeEditMode", true);
    },
    async handleUpload(idx) {
      if (!this.uploadForm[idx].name && !this.uploadForm[idx].artist) {
        alert("You can't leave the song name and artist name empty!");
        return;
      } else if (!this.uploadForm[idx].name) {
        alert("You can't leave the song name empty!");
        return;
      } else if (!this.uploadForm[idx].artist) {
        alert("You can't leave the artist name empty!");
        return;
      }
      this.$store.commit("changeEditMode", false);
      let self = this;
      let file = this.uploadForm[idx].file;
      let artist = this.uploadForm[idx].artist;
      let name = this.uploadForm[idx].name;
      await this.storageUpload(file, function(res) {
        res.artist = artist;
        res.name = name;
        res.ABLoops = [];
        res.editing = false;
        // add file path to db
        let db = firebase.firestore();
        let usersRef = db.collection("users");
        var userRef = usersRef.doc(self.$store.getters.user.uid);
        userRef
          .update({
            songs: firebase.firestore.FieldValue.arrayUnion(
              _.omit(res, "editing")
            )
          })
          .then(function() {
            self.songList.push(res);
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
    },
    cancelUpload: function(idx) {
      var removeLink = this.uploadForm[idx].file.previewElement.querySelector(
        ".dz-remove"
      );
      removeLink.click();
      this.uploadForm.splice(idx, 1);
    },
    handleDelete: function(idx, event) {
      event.stopPropagation();
      let res = window.confirm(
        `Are you sure to delete ${this.songList[idx].name} by ${this.songList[idx].artist}?`
      );
      if (res) {
        this.$store.commit("toggleLoading", true); // Loading view
        let db = firebase.firestore();
        let userUid = this.$store.getters.user.uid;
        db.collection("users")
          .doc(userUid)
          .update({
            songs: firebase.firestore.FieldValue.arrayRemove(this.songList[idx])
          })
          .then(
            function() {
              let storageRef = firebase.storage().ref();
              let fileRef = storageRef.child(this.songList[idx].path);
              fileRef.delete().then(
                function() {
                  this.songList.splice(idx, 1);
                  this.$store.commit("toggleLoading", false);
                }.bind(this)
              );
            }.bind(this)
          );
      } else {
        return;
      }
    },
    handleEdit: function(idx, event) {
      event.stopPropagation();
      if (this.songList[idx].editing) {
        this.execEdit(idx, event);
        this.$store.commit("changeEditMode", false);
      } else {
        this.songListEdit = JSON.parse(JSON.stringify(this.songList)); // deep copy
        this.$store.commit("changeEditMode", true);
        this.editNames(idx, event);
      }
    },
    editNames: function(idx, event) {
      this.songList[idx].editing = true;
      event.target.classList.remove("mdi-pencil-outline");
      event.target.classList.add("mdi-check");
      let columns = event.target.parentNode.parentNode.children;
      let artist = columns[0];
      let name = columns[1];
      artist.contentEditable = true;
      name.contentEditable = true;
      artist.focus();
    },
    execEdit: function(idx, event) {
      const db = firebase.firestore();
      const userUid = this.$store.getters.user.uid;
      const updatedData = firebase.firestore.FieldValue.arrayUnion(
        _.omit(this.songListEdit[idx], "editing")
      );
      db.collection("users")
        .doc(userUid)
        .update({
          songs: firebase.firestore.FieldValue.arrayRemove(
            _.omit(this.songList[idx], "editing")
          )
        })
        .then(function() {
          db.collection("users")
            .doc(userUid)
            .update({
              songs: updatedData
            })
            .then(function() {
              let columns = event.target.parentNode.parentNode.children;
              let artist = columns[0];
              let name = columns[1];
              artist.contentEditable = false;
              name.contentEditable = false;
              event.target.classList.remove("mdi-check");
              event.target.classList.add("mdi-pencil-outline");
            });
        });
    },
    syncArtist: function(idx, event) {
      this.songListEdit[idx].artist = event.target.innerText;
    },
    syncName: function(idx, event) {
      this.songListEdit[idx].name = event.target.innerText;
    },
    changeSong: async function(idx) {
      let song = this.songList[idx];
      await this.$store.dispatch("setSource", song);
      this.$emit("close");
      this.$store.commit("setCurrentSong", this.songList[idx]);
    }
  }
};
</script>

<style>
.icon {
  cursor: pointer;
}
</style>