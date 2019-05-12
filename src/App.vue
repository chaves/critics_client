<template>
  <v-app>
    <v-toolbar dark color="primary" app>
      <v-toolbar-title class="headline text-uppercase white--text">
        <span>Critics - interface</span>
      </v-toolbar-title>
      <v-select
        :items="items"
        prepend-icon="map"
        v-model="selected"
        single-line
        background-color="white"
      ></v-select>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      selected: "All",
      items: ["All", "Abir", "Bruno", "Svitlana", "Yifei"]
    };
  }
};
</script>
