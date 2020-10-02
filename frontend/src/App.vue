<template>
  <div id="app">
    <Header></Header>
    <SearchForm></SearchForm>
    <VideoLoad></VideoLoad>
  </div>
</template>

<script>
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import VideoLoad from "./components/VideoLoad";
export default {
  name: "App",
  components: { SearchForm, Header, VideoLoad },

  created() {
    this.$store.dispatch("startConnection");
    window.onbeforeunload = function () {
      console.log("Closing the connection" + this.$store.state.ws);
      this.$store.state.ws.close();
    };
  },
  methods: {},
};
</script>

<style>
</style>
