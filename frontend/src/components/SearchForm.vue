<template>
  <div class="form-container">
    <form class="search-form">
      <input
        type="text"
        placeholder="Place here your URL"
        v-model="searchInputData"
      />
      <button v-on:click="clickHandler" class="btn-search">Connect</button>
    </form>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      searchInputData: "",
    };
  },
  methods: {
    clickHandler: function (event) {
      event.preventDefault();

      this.$store.dispatch("setlinkurl", this.searchInputData);
      this.$store.dispatch("start");
    },
  },
};
</script>
  
<style>
.form-container {
  width: 100%;
}
input[type="text"] {
  width: 30%;
  font-size: 0.5rem;
}
.search-form {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.btn-search {
  color: white;
  background-color: #2ecc71;
  border: none;
  border-radius: 5%;
  cursor: pointer;
  font-weight: bold;
  margin-left: 0.5rem;
  padding: 0.2rem;
}
</style>