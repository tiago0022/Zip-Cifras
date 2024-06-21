<template>
  <Song/>
</template>

<script>
import Song from './components/SongComponent.vue'

export default {
  name: 'App',
  components: {
    Song
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: small;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 1rem;
}
</style>
