<template>
  <div>
    
    <h1>Zip Cifras</h1>
    
    <h2>{{ song.name }}</h2>
    
    <ul v-if="song.sections">
      <li v-for="(section, index) in song.sections" :key="index">
        <h3>{{ section.name }}:</h3>
          <span v-for="(token, index) in section.tokens" :key="index">
            {{ token.content }}&nbsp;
          </span>
      </li>
    </ul>

    <p v-else>No song data available</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      song: {}
    };
  },
  mounted() {
    // TODO: add configuration file
    axios.get('http://localhost:3000/songs/Descobridor%20dos%207%20Mares')
      .then(response => {
        console.log(response)
        this.song = response.data;
      })
      .catch(error => {
        console.error('Error fetching song data:', error);
      });
  }
};
</script>

<style scoped>

h3 {
  display: inline-block;
  margin: 0 1rem;
}

a {
  color: #42b983;
}

</style>
