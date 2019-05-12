<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-tabs fixed-tabs>
          <v-tabs-slider></v-tabs-slider>

          <v-tab :href="'#tab1'" :key="1">tweets to labelize</v-tab>
          <v-tab :href="'#tab2'" :key="2">tweets done</v-tab>

          <v-tabs-items>
            <v-tab-item :value="'tab1'" :key="1">
              <v-expansion-panel popout v-model="panel">
                <v-expansion-panel-content v-for="(tweet, id) in tweets" :key="id">
                  <div slot="header">{{ tweet.text }}</div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-tab-item>

            <v-tab-item :value="'tab2'" :key="2">
              <v-expansion-panel inset>
                <v-expansion-panel-content v-for="(tweet, id) in tweets" :key="id">
                  <div slot="header">{{ tweet.text }}</div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    url: "tweets",
    tweets: [],
    regles: [],
    pagination: {},
    page: 1,
    panel: []
  }),

  mounted() {
    this.getAjax();
  },
  methods: {
    getData: function(data) {
      let pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        next_page_url: data.next_page_url,
        prev_page_url: data.prev_page_url
      };
      this.pagination = pagination;
      this.tweets = data.data;
      console.log(data.data);
    },
    getAjax: function() {
      window.axios.get(this.url).then(response => this.getData(response.data));
    }
  },
  watch: {
    page: function() {
      this.getAjax();
    },
    url: function() {
      this.getAjax();
    }
  },
  components: {}
};
</script>

<style>
</style>
