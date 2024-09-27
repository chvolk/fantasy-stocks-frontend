<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary v-if="isAuthenticated">
      <v-list>
        <v-list-item to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="/leaderboard">
          <v-list-item-icon>
            <v-icon>mdi-trophy</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Leaderboard</v-list-item-title>
        </v-list-item>
        <v-list-item to="/draft">
          <v-list-item-icon>
            <v-icon>mdi-chart-line</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Draft</v-list-item-title>
        </v-list-item>
        <v-list-item @click="signOut">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Sign Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="isAuthenticated"></v-app-bar-nav-icon>
      <v-toolbar-title>Moq Exchange</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="isAuthenticated">
        <v-btn icon to="/dashboard">
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>
        <v-btn icon to="/leaderboard">
          <v-icon>mdi-trophy</v-icon>
        </v-btn>
        <v-btn icon to="/draft">
          <v-icon>mdi-chart-line</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
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
}
</script>
