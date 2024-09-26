<template>
    <v-container>
      <h2 class="text-h4 mb-4">Draft Stocks</h2>
      <v-alert v-if="error" type="error" dismissible>
        {{ error }}
      </v-alert>
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              Available Stocks
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="availableStocks"
              :search="search"
              :items-per-page="10"
              :loading="loading"
              :sort-by="['current_price']"
              :sort-desc="[true]"
              class="elevation-1"
            >
              <template v-slot:item.current_price="{ item }">
                ${{ item.current_price }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn small color="primary" @click="draftStock(item)">Draft</v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Your Portfolio</v-card-title>
            <v-list>
              <v-list-item v-for="stock in draftedStocks" :key="stock.symbol">
                <v-list-item-content>
                  <v-list-item-title>{{ stock.symbol }}</v-list-item-title>
                  <v-list-item-subtitle>{{ stock.name }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  ${{ stock.current_price }}
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'StockDraft',
    data: () => ({
      headers: [
        { text: 'Symbol', value: 'symbol' },
        { text: 'Name', value: 'name' },
        { 
          text: 'Current Price', 
          value: 'current_price', 
          sort: (a, b) => {
            const priceA = parseFloat(a.replace('$', ''));
            const priceB = parseFloat(b.replace('$', ''));
            return priceB - priceA;
          }
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      availableStocks: [],
      draftedStocks: [],
      search: '',
      loading: false,
      error: null,
    }),
    mounted() {
      this.fetchAvailableStocks()
    },
    methods: {
      async fetchAvailableStocks() {
        this.loading = true
        this.error = null
        try {
          const response = await axios.get('/api/stocks/available/')
          this.availableStocks = response.data
          console.log('Fetched stocks:', this.availableStocks)
        } catch (error) {
          console.error('Error fetching stocks:', error)
          this.error = 'Failed to fetch available stocks. Please try again later.'
        } finally {
          this.loading = false
        }
      },
      async draftStock(stock) {
        try {
          const response = await axios.post('/api/stocks/draft/', { symbol: stock.symbol })
          console.log(response.data.message)
          this.draftedStocks.push(stock)
          this.availableStocks = this.availableStocks.filter(s => s.symbol !== stock.symbol)
        } catch (error) {
          console.error('Error drafting stock:', error)
          this.error = 'Failed to draft stock. Please try again.'
        }
      },
    },
  }
  </script>