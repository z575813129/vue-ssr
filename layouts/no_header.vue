<template>
  <v-app>
    <v-content>
      <v-container fluid class="lighten-4 fill-height">
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
    }
  }
}
</script>
