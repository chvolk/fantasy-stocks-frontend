<template>
    <v-container>
      <h2>Dashboard</h2>
      <v-data-table
        :headers="headers"
        :items="portfolio"
        class="elevation-1"
      ></v-data-table>
      <v-btn to="/draft">Draft Stocks</v-btn>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'

  export default {
    name: 'UserDashboard',
    data: () => ({
      headers: [
        { text: 'Symbol', value: 'stock.symbol' },
        { text: 'Name', value: 'stock.name' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Current Price', value: 'stock.current_price' },
      ],
      portfolio: [],
    }),
    mounted() {
      this.fetchPortfolio()
    },
    methods: {
      async fetchPortfolio() {
        try {
          const response = await axios.get('/api/portfolio/')
          this.portfolio = response.data.stocks
        } catch (error) {
          console.error('Error fetching portfolio:', error)
        }
      },
    },
  }
  </script>