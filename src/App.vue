<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app v-if="isAuthenticated" temporary>
      <v-list>
        <v-list-item to="/dashboard">
          <template v-slot:prepend>
            <v-icon>mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="/leaderboard">
          <template v-slot:prepend>
            <v-icon>mdi-trophy</v-icon>
          </template>
          <v-list-item-title>Leaderboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="/draft">
          <template v-slot:prepend>
            <v-icon>mdi-chart-line</v-icon>
          </template>
          <v-list-item-title>Draft</v-list-item-title>
        </v-list-item>
        <v-list-item to="/bazaar">
          <template v-slot:prepend>
            <v-icon>mdi-store</v-icon>
          </template>
          <v-list-item-title>Bazaar</v-list-item-title>
        </v-list-item>  
        <v-list-item to="/faq">
          <template v-slot:prepend>
            <v-icon>mdi-help-circle</v-icon>
          </template>
          <v-list-item-title>FAQ/How to Play</v-list-item-title>
        </v-list-item>
        <v-list-item to="/privacy-policy">
          <template v-slot:prepend>
            <v-icon>mdi-shield-account</v-icon>
          </template>
          <v-list-item-title>Privacy Policy</v-list-item-title>
        </v-list-item>
        <v-list-item @click="signOut">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
        <v-spacer></v-spacer>
      </v-list>

      <template v-slot:append>
        <div class="pa-2 custom-footer">
          <div class="text-center">
            &copy; {{ new Date().getFullYear() }} North Atlantic Tech™
          </div>
          <div class="text-center mt-1">
            <v-btn
              icon
              small
              href="https://discord.gg/8jkae3hKW5"
              target="_blank"
              rel="noopener noreferrer"
              color="white"
            >
              <v-icon>mdi-discord</v-icon>
            </v-btn>
            <p>Join us on Discord!</p>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="isAuthenticated"></v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')" style="cursor: pointer;">
        Moq Exchange
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="isAuthenticated">
        <v-btn icon to="/dashboard" v-tooltip="'Dashboard'">
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>

        <v-btn icon to="/leaderboard" v-tooltip="'Leaderboard'">
          <v-icon>mdi-trophy</v-icon>
        </v-btn>

        <v-btn icon to="/draft" v-tooltip="'Draft Stocks'">
          <v-icon>mdi-chart-line</v-icon>
        </v-btn>

        <v-btn icon to="/bazaar" v-tooltip="'Bazaar'">
          <v-icon>mdi-store</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <!-- <v-footer app padless color="turquoise" class="custom-footer">
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <span>&copy; {{ new Date().getFullYear() }} North Atlantic Tech™</span>
          <v-btn
            icon
            small
            class="ml-2"
            href="https://discord.gg/8jkae3hKW5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-icon>mdi-discord</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  metaInfo: {
    title: 'Moq Exchange. Trade stocks with virtual currency, climb the leaderboard and build your persistent portfolio.',
    meta: [
      { name: 'description', content: 'Experience the thrill of stock trading without the risk. Learn investing strategies, compete with friends, and take your chances pulling stocks from packs for your persistent portfolio.' },
      { name: 'keywords', content: 'fantasy stocks, virtual trading, stock market simulation, investing game, financial education, stock packs, leaderboard, roguelike, stock roguelike, stock market game, stock market simulator, stock trading game, stock trading simulator' },
      { name: 'author', content: 'Moq Exchange' },
    ],
  },
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async signOut() {
      await this.logout();
      this.$router.push('/');
    },
  },
}
</script>
<style scoped>
.custom-footer {
  background-color: #008B8B !important; /* Dark Turquoise color */
  color: white;
}
</style>