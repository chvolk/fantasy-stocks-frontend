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
              class="elevation-1 mb-6"
            >
              <template v-slot:item.gain_loss="{ item }">
                <span :class="item.gain_loss >= 0 ? 'success--text' : 'error--text'">
                  {{ item.gain_loss >= 0 ? '+' : '-' }}${{ Math.abs(item.gain_loss).toFixed(2) }}
                </span>
              </template>
            </v-data-table>
  
            <!-- <v-card-title class="text-h5 font-weight-bold mb-4">
              Portfolio Value History
            </v-card-title>
            <canvas ref="chart"></canvas> -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'

  export default {
    name: 'Leaderboard',
    data() {
      return {
        headers: [
          { title: 'Rank', align: 'start', value: 'rank' },
          { title: 'Username', align: 'start', value: 'username' },
          { title: 'Total Value', align: 'end', value: 'total_value' },
          { title: 'Gain/Loss', align: 'end', value: 'gain_loss' },
        ],
        leaderboard: [],
        chart: null,
        Chart: null,
      }
    },
    async mounted() {
      this.fetchLeaderboard()
      this.fetchPortfolioHistory()
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
      async fetchPortfolioHistory() {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get('/api/portfolio-history/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          })
          const data = response.data

          const ctx = this.$refs.chart.getContext('2d')
          this.chart = new this.Chart(ctx, {
            type: 'line',
            data: {
              labels: data.map(entry => new Date(entry.timestamp).toLocaleString()),
              datasets: [{
                label: 'Portfolio Value',
                data: data.map(entry => entry.total_value),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day'
                  }
                },
                y: {
                  beginAtZero: true
                }
              }
            }
          })
        } catch (error) {
          console.error('Error fetching portfolio history:', error)
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