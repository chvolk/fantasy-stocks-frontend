<template>
  <v-container fluid class="fill-height pa-0" style="background: linear-gradient(to right, #2196F3, #4CAF50);">
    <v-row align="center" justify="center" class="mx-0">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-6">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">
            Your Dashboard
          </v-card-title>

          <v-card outlined>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Your Portfolio</span>
              <v-btn
                color="primary"
                to="/draft"
              >
                <v-icon left>mdi-plus</v-icon>
                Draft Stocks
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="portfolioWithTotalValue"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.stock.symbol="{ item }">
                  <v-chip
                    :color="getRandomColor(item.stock.symbol)"
                    text-color="white"
                    small
                  >
                    {{ item.stock.symbol }}
                  </v-chip>
                </template>
                <template v-slot:item.stock.current_price="{ item }">
                  ${{ item.stock.current_price.toFixed(2) }}
                </template>
                <template v-slot:item.totalValue="{ item }">
                  ${{ item.totalValue.toFixed(2) }}
                </template>
                <template v-slot:footer>
                  <v-row class="mt-2 pa-2" align="center" justify="space-between">
                    <strong>Total Portfolio Value:</strong>
                    <span class="text-h5 font-weight-bold">${{ totalPortfolioValue.toFixed(2) }}</span>
                  </v-row>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>

          <v-card outlined class="mt-6">
            <v-card-title>Performance Overview</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-card outlined>
                    <v-card-text class="text-center">
                      <div class="text-h6">Total Gain/Loss</div>
                      <div :class="['text-h4', totalGainLoss >= 0 ? 'success--text' : 'error--text']">
                        {{ totalGainLoss >= 0 ? '+' : '-' }}${{ Math.abs(totalGainLoss).toFixed(2) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <!-- Add more performance metrics here -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserDashboard',
  data: () => ({
    headers: [
      { text: 'Ticker', value: 'stock.symbol' },
      { text: 'Name', value: 'stock.name' },
      { text: 'Quantity', value: 'quantity', align: 'end' },
      { text: 'Price', value: 'stock.current_price', align: 'end' },
      { text: 'Total Value', value: 'totalValue', align: 'end' },
    ],
    portfolio: [],
    totalGainLoss: 0, // This is a placeholder. You'll need to calculate this based on purchase prices.
  }),
  computed: {
    portfolioWithTotalValue() {
      return this.portfolio.map(item => ({
        ...item,
        totalValue: item.quantity * item.stock.current_price
      }));
    },
    totalPortfolioValue() {
      return this.portfolioWithTotalValue.reduce((sum, item) => sum + item.totalValue, 0);
    }
  },
  mounted() {
    this.fetchPortfolio()
  },
  methods: {
    async fetchPortfolio() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/portfolio/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.portfolio = response.data.stocks
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      }
    },
    getRandomColor(symbol) {
      const colors = ['primary', 'secondary', 'accent', 'success', 'info', 'warning'];
      const index = symbol.charCodeAt(0) % colors.length;
      return colors[index];
    }
  },
}
</script>