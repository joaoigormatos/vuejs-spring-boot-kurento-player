<template>
  <div class="video-container">
    <video
      autoplay
      id="remoteStream"
      width="640px"
      height="350px"
      controls
    ></video>
  </div>
</template>

<script>
export default {
  mounted() {
    const videoRef = document.getElementById("remoteStream");
    this.$store.dispatch("setVideoRef", videoRef);
  },
};
</script>

<style>
video {
  display: block;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.video-container {
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
}
#remote-stream {
  width: 50%;
  height: 50vh;
  border-radius: 1%;
}
</style>