<template>
  <span contenteditable="true" v-text="innerContent" @input="sync"></span>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Editor",
  props: ["content"],
  data() {
    return {
      innerContent: ""
    };
  },
  methods: {
    sync(e) {
      this.$emit("update", e.target.innerHTML);
    }
  },
  mounted() {
    this.innerContent = this.content;
  }
});
</script>