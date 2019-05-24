<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs4 offset-xs4>
        <v-select :items="items" prepend-icon="face" v-model="owner"></v-select>
      </v-flex>

      <v-flex xs8 offset-xs2>
        <v-layout row wrap>
          <v-flex xs4>
            <div class="column">
              <doughnut-chart
                :percent="critiques_sur_cent"
                :visibleValue="true"
                foregroundColor="red"
                :strokeWidth="12"
                :height="100"
                :width="100"
              />
              <span>Critisism</span>
            </div>
          </v-flex>

          <v-flex xs4>
            <div class="column">
              <doughnut-chart
                :percent="constructive_sur_cent"
                :visibleValue="true"
                foregroundColor="green"
                :strokeWidth="12"
                :height="100"
                :width="100"
              />Constructive
            </div>
          </v-flex>
          <v-flex xs4>
            <div class="column">
              <doughnut-chart
                :percent="ignore_sur_cent"
                :visibleValue="true"
                foregroundColor="grey"
                :strokeWidth="12"
                :height="100"
                :width="100"
              />ignored
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex>
        <v-tabs fixed-tabs>
          <v-tabs-slider></v-tabs-slider>

          <v-tab :href="'#tab1'" :key="1" @click="url = 'tweets'">tweets to labelize</v-tab>
          <v-tab :href="'#tab2'" :key="2" @click="url = 'tweets/done'">tweets done</v-tab>

          <v-tabs-items style="margin-top: 12px">
            <v-tab-item :value="'tab1'" :key="1">
              <v-expansion-panel inset>
                <v-expansion-panel-content v-for="(tweet, id) in tweets" :key="id">
                  <div slot="header">
                    <v-layout row wrap>
                      <v-flex xs8>
                        <strong>{{ tweet.hashtag }}</strong> :
                        <span :class="[tweet.ignore ? 'ignored' : '']">{{ tweet.text }}</span>
                      </v-flex>
                      <v-flex xs4>
                        <span v-if="tweet.criticism === 'yes'">
                          <v-btn depressed small color="red darken-2" dark>Criticism</v-btn>
                        </span>
                        <span v-else-if="tweet.criticism === 'no'">
                          <v-btn depressed small color="green" dark>Not a criticism</v-btn>
                        </span>
                        <span v-if="tweet.constructive === 'yes'">
                          <v-btn depressed small color="green" dark>Constructive</v-btn>
                        </span>
                        <span v-else-if="tweet.constructive === 'no'">
                          <v-btn depressed small color="red darken-2" dark>Not constructive</v-btn>
                        </span>
                      </v-flex>
                    </v-layout>
                  </div>
                  <v-card>
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs4>
                          <v-radio-group
                            v-model="tweet.criticism"
                            row
                            @click="s_criticism(tweet.id, tweet.criticism)"
                          >
                            Criticism : &nbsp;
                            <v-radio label="yes" value="yes"></v-radio>
                            <v-radio label="no" value="no"></v-radio>
                          </v-radio-group>
                        </v-flex>

                        <v-flex xs4>
                          <v-radio-group
                            v-model="tweet.constructive"
                            row
                            @click="s_constructive(tweet.id, tweet.constructive)"
                          >
                            Constructive : &nbsp;
                            <v-radio label="yes" value="yes"></v-radio>
                            <v-radio label="no" value="no"></v-radio>
                          </v-radio-group>
                        </v-flex>

                        <v-flex xs2>
                          <v-switch
                            :label="`Ignore`"
                            v-model="tweet.ignore"
                            @click.native="s_ignore(tweet.id)"
                          ></v-switch>
                        </v-flex>

                        <v-flex xs1>
                          <v-btn fab color="green" dark small @click.native="s_done(tweet.id, id)">
                            <v-icon>done_all</v-icon>
                          </v-btn>
                        </v-flex>

                        <v-flex xs1>
                          <v-btn
                            fab
                            color="primary"
                            dark
                            small
                            @click.native="link_to_tweet(tweet.screenName, tweet.tweet_id)"
                          >
                            <v-icon>link</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-tab-item>

            <v-tab-item :value="'tab2'" :key="2">
              <v-expansion-panel inset>
                <v-expansion-panel-content v-for="(tweet, id) in tweets" :key="id">
                  <div slot="header">
                    <v-layout row wrap>
                      <v-flex xs8>
                        <strong>{{ tweet.hashtag }}</strong> :
                        <span :class="[tweet.ignore ? 'ignored' : '']">{{ tweet.text }}</span>
                      </v-flex>
                      <v-flex xs4>
                        <span v-if="tweet.criticism === 'yes'">
                          <v-btn depressed small color="red darken-2" dark>Criticism</v-btn>
                        </span>
                        <span v-else-if="tweet.criticism === 'no'">
                          <v-btn depressed small color="green" dark>Not a criticism</v-btn>
                        </span>
                        <span v-if="tweet.constructive === 'yes'">
                          <v-btn depressed small color="green" dark>Constructive</v-btn>
                        </span>
                        <span v-else-if="tweet.constructive === 'no'">
                          <v-btn depressed small color="red darken-2" dark>Not constructive</v-btn>
                        </span>
                      </v-flex>
                    </v-layout>
                  </div>
                  <v-flex xs2 offset-xs5>
                    <v-btn fab color="red" dark small @click.native="s_un_done(tweet.id, id)">
                      <v-icon>undo</v-icon>
                    </v-btn>
                  </v-flex>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
    <pagination-sources :pagination="pagination" :page="page" @newPage="page = $event"/>
  </v-container>
</template>

<script>
import paginationSources from "./parts/paginationSources";
import DoughnutChart from "./parts/DoughnutChart";

export default {
  data: () => ({
    url: "tweets",
    owner: "All",
    tweets: [],
    regles: [],
    pagination: {},
    stats: {},
    page: 1,
    row: null,
    items: ["All", "Abir", "Bruno", "Svitlana", "Yifei"]
  }),
  computed: {
    // un accesseur (getter) calculé
    critiques_sur_cent: function() {
      // `this` pointe sur l'instance vm
      return Math.round(
        (this.stats.critiques_nb_yes /
          (this.stats.critiques_nb_yes + this.stats.critiques_nb_no)) *
          100
      );
    },
    constructive_sur_cent: function() {
      return Math.round(
        (this.stats.constructive_nb_yes /
          (this.stats.constructive_nb_yes + this.stats.constructive_nb_no)) *
          100
      );
    },
    ignore_sur_cent: function() {
      return Math.round(
        (this.stats.ignore_nb_yes /
          (this.stats.ignore_nb_yes + this.stats.ignore_nb_no)) *
          100
      );
    }
  },
  mounted() {
    this.getAjax();
    this.getStats();
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
    },
    getStatsData: function(data) {
      let stats = {
        critiques_nb_yes: data.critiques_nb_yes,
        critiques_nb_no: data.critiques_nb_no,

        constructive_nb_yes: data.constructive_nb_yes,
        constructive_nb_no: data.constructive_nb_no,

        ignore_nb_yes: data.ignore_nb_yes,
        ignore_nb_no: data.ignore_nb_no
      };
      this.stats = stats;
    },
    getAjax: function() {
      window.axios
        .get(this.url + "/" + this.owner.toLowerCase() + "?page=" + this.page)
        .then(response => this.getData(response.data));
    },
    getStats: function() {
      window.axios
        .get("stats/" + this.owner.toLowerCase())
        .then(response => this.getStatsData(response.data));
    },
    s_criticism: function(id, value) {
      window.axios
        .post("tweets/update/criticism", { id: id, value: value })
        .then()
        .catch();
    },
    s_constructive: function(id, value) {
      window.axios
        .post("tweets/update/constructive", { id: id, value: value })
        .then()
        .catch();
    },
    s_ignore: function(id) {
      window.axios
        .post("tweets/update/ignore", { id: id })
        .then()
        .catch();
    },
    s_done: function(id, key) {
      // this.$delete(this.tweets, id);
      window.axios
        .post("tweets/update/done", { id: id })
        .then(this.$delete(this.tweets, key))
        .catch();
    },
    s_un_done: function(id, key) {
      // this.$delete(this.tweets, id);
      window.axios
        .post("tweets/update/un_done", { id: id })
        .then(this.$delete(this.tweets, key))
        .catch();
    },
    link_to_tweet: function(screenName, tweet_id) {
      let win = window.open(
        "https://twitter.com/" + screenName + "/status/" + tweet_id,
        "_blank"
      ); // https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window-using-javascript
      win.focus();
    }
  },
  watch: {
    page: function() {
      this.getAjax();
      this.getStats();
    },
    url: function() {
      this.getAjax();
      this.getStats();
    },
    owner: function() {
      this.getAjax();
      this.getStats();
    }
  },
  components: {
    "pagination-sources": paginationSources,
    "doughnut-chart": DoughnutChart
  }
};
</script>

<style>
.ignored {
  text-decoration: line-through;
}
.column {
  display: inline-flex;
}
</style>
