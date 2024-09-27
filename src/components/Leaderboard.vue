<template>
    <v-container fluid class="fill-height pa-0" style="background: linear-gradient(to right, #2196F3, #4CAF50);">
      <v-row align="center" justify="center" class="mx-0">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="12" class="pa-6">
            <v-card-title class="text-h4 font-weight-bold text-center mb-4">
              Leaderboard
            </v-card-title>
  
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'Leaderboard',
    data: () => ({
      headers: [
        { title: 'Rank', align: 'start', value: 'rank' },
        { title: 'Username', align: 'start', value: 'username' },
        { title: 'Total Value', align: 'end', value: 'total_value' },
        { title: 'Gain/Loss', align: 'end', value: 'gain_loss' },
      ],
      leaderboard: [],
    }),
    mounted() {
      this.fetchLeaderboard()
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