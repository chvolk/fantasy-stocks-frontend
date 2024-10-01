<template>
  <v-container fluid class="fill-height pa-0" style="background: linear-gradient(to right, #2196F3, #4CAF50);">
    <v-row align="center" justify="center" class="mx-0">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-6">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">
            Leaderboards
          </v-card-title>

          <v-tabs v-model="activeTab" centered>
            <v-tab>Weekly Portfolio Value</v-tab>
            <v-tab>Total Moqs</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item>
              <v-data-table
                :headers="headers"
                :items="leaderboard"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.gain_loss="{ item }">
                  <span :class="item.gain_loss >= 0 ? 'success--text' : 'error--text'">
                    {{ item.gain_loss >= 0 ? '+' : '-' }}${{ Math.abs(item.gain_loss).toFixed(2) }}
                  </span>
                </template>
              </v-data-table>
            </v-window-item>

            <v-window-item>
              <v-data-table
                :headers="moqHeaders"
                :items="moqLeaderboard"
                :items-per-page="10"
                class="elevation-1"
              >
              </v-data-table>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
  import axios from 'axios'
  import { VTabs, VTab } from 'vuetify/components'
  export default {
    name: 'Leaderboard',
    components: {
      VTabs,
      VTab
    },
    
    data: () => ({
      activeTab: 0,
      headers: [
        { title: 'Rank', align: 'start', value: 'rank' },
        { title: 'Username', align: 'start', value: 'username' },
        { title: 'Total Value', align: 'end', value: 'total_value' },
        { title: 'Gain/Loss', align: 'end', value: 'gain_loss' },
      ],
      leaderboard: [],
      moqHeaders: [
      { title: 'Rank', align: 'start', value: 'rank' },
      { title: 'Username', align: 'start', value: 'username' },
      { title: 'Total Moqs', align: 'end', value: 'total_moqs' },
      ],
      moqLeaderboard: [],
    }),
    mounted() {
      this.fetchLeaderboard()
      this.fetchMoqLeaderboard()
    },
    methods: {
      async fetchLeaderboard() {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get('/api/leaderboard/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          })
          this.leaderboard = response.data.map((item, index) => ({
            ...item,
            rank: index + 1,
            total_value: Number(item.total_value).toFixed(2),
            gain_loss: Number(item.gain_loss)
          }))
        } catch (error) {
          console.error('Error fetching leaderboard:', error)
        }
      },
      async fetchMoqLeaderboard() {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get('/api/moq-leaderboard/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          })
          console.log(response)
          this.moqLeaderboard = response.data.map((item, index) => ({
            ...item,
            rank: index + 1,
            total_moqs: Number(item.total_moqs).toFixed(2),
          }))
          console.log(this.moqLeaderboard)
        } catch (error) {
          console.error('Error fetching moq leaderboard:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .success--text {
    color: #4CAF50 !important;
  }
  
  .error--text {
    color: #F44336 !important;
  }
  </style>