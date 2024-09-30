<template>
    <v-container fluid class="fill-height pa-0" style="background: linear-gradient(to right, #4CAF50, #2196F3);">
      <v-row align="center" justify="center" class="mx-0">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="12" class="pa-6">
            <v-card-title class="text-h4 font-weight-bold text-center mb-4">
              The Bazaar
            </v-card-title>
            
            <!-- User's Gains and Moqs -->
            <v-row class="mb-6">
              <v-col cols="6">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <div class="text-h6">Available Gains</div>
                    <div class="text-h4">${{ availableGains.toFixed(2) }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <div class="text-h6">Total Moqs</div>
                    <div class="text-h4">{{ totalMoqs }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
  
            <!-- Buy Packs -->
            <v-card outlined class="mb-6">
              <v-card-title>Buy Packs</v-card-title>
              <v-card-text>
                <v-btn color="primary" @click="buyPack('gains')">Buy Pack with Gains (${{ packPriceGains }})</v-btn>
                <v-btn color="secondary" class="ml-2" @click="buyPack('moqs')">Buy Pack with Moqs ({{ packPriceMoqs }} Moqs)</v-btn>
              </v-card-text>
            </v-card>
  
            <!-- Inventory -->
            <v-card outlined class="mb-6">
              <v-card-title>Your Inventory</v-card-title>
              <v-data-table
                :headers="inventoryHeaders"
                :items="inventory"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn small color="info" @click="listStock(item)">List</v-btn>
                </template>
              </v-data-table>
            </v-card>
  
            <!-- Bazaar -->
            <v-card outlined>
              <v-tabs v-model="bazaarTab">
                <v-tab>Market</v-tab>
                <v-tab>Your Listings</v-tab>
              </v-tabs>
              <v-tabs-items v-model="bazaarTab">
                <v-tab-item>
                  <!-- Market Tab -->
                  <v-card flat>
                    <v-card-text>
                      <v-text-field v-model="marketSearch" label="Search" prepend-icon="mdi-magnify"></v-text-field>
                      <v-data-table
                        :headers="marketHeaders"
                        :items="filteredMarketListings"
                        :items-per-page="5"
                        class="elevation-1"
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-btn small color="primary" @click="buyListedStock(item)">Buy</v-btn>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <!-- Your Listings Tab -->
                  <v-card flat>
                    <v-card-text>
                      <v-data-table
                        :headers="listingsHeaders"
                        :items="userListings"
                        :items-per-page="5"
                        class="elevation-1"
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-btn small color="primary" @click="editListing(item)">Edit</v-btn>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Pack Opening Dialog -->
      <v-dialog v-model="packDialog" max-width="600px" per>
        <v-card>
          <v-card-title class="text-h5">Pack Opening</v-card-title>
          <v-card-text>
            <v-container v-if="packOpeningState === 'selecting'">
              <v-row justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  :size="70"
                  :width="7"
                ></v-progress-circular>
              </v-row>
              <v-row justify="center" class="mt-4">
                <span class="text-h6">Selecting Industry...</span>
                </br>
                <v-spacer class="my-4"></v-spacer>
              </v-row>
            <v-spacer class="my-4"></v-spacer>
            </v-container>
            <v-container v-else-if="packOpeningState === 'revealing' || packOpeningState === 'revealed'">
              <v-row justify="center">
                <span class="text-h6">{{ selectedIndustry }}</span>
              </v-row>
              
              <v-data-table
                :headers="headers"
                :items="visiblePackStocks"
                :items-per-page="5"
                hide-default-footer
                class="elevation-1"
              >
                <template v-slot:item.action="{ item }">
                  <v-btn
                    small
                    color="primary"
                    @click="selectPackStock(item)"
                    :disabled="packOpeningState !== 'revealed'"
                  >
                    Add to Inventory
                  </v-btn>
                </template>
              </v-data-table>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="packDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Confirmation Dialogs -->
      <v-dialog v-model="confirmDialog" max-width="300">
        <v-card>
          <v-card-title class="text-h5">Confirm Action</v-card-title>
          <v-card-text>{{ confirmMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="confirmDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="confirmAction">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { inject } from 'vue'
  import confetti from 'canvas-confetti'
  export default {
    name: 'BazaarPage',
    setup() {
      const api = inject('api')
      return { api }
    },
    data: () => ({
      availableGains: 0,
      totalMoqs: 0,
      packPriceGains: 1000,
      packPriceMoqs: 100,
      inventory: [],
      marketListings: [],
      userListings: [],
      bazaarTab: null,
      marketSearch: '',
      packDialog: false,
      selectedIndustry: null,
      packStocks: [],
      visiblePackStocks: [],
      confirmDialog: false,
      confirmMessage: '',
      confirmAction: () => {},
      packOpeningState: 'idle',
      inventoryHeaders: [
        { title: 'Symbol', value: 'symbol' },
        { title: 'Name', value: 'name' },
        { title: 'Industry', value: 'industry' },
        { title: 'Current Price', value: 'current_price' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      marketHeaders: [
        { title: 'Symbol', value: 'symbol' },
        { title: 'Name', value: 'name' },
        { title: 'Industry', value: 'industry' },
        { title: 'Price (Moqs)', value: 'price' },
        { title: 'Seller', value: 'seller' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      listingsHeaders: [
        { title: 'Symbol', value: 'symbol' },
        { title: 'Name', value: 'name' },
        { title: 'Industry', value: 'industry' },
        { title: 'Price (Moqs)', value: 'price' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      headers: [
        { text: 'Symbol', value: 'symbol' },
        { text: 'Name', value: 'name' },
        { text: 'Current Price', value: 'current_price' },
        { text: 'Action', value: 'action', sortable: false }
      ],
    }),
    computed: {
      filteredMarketListings() {
        return this.marketListings.filter(listing =>
          listing.symbol.toLowerCase().includes(this.marketSearch.toLowerCase()) ||
          listing.name.toLowerCase().includes(this.marketSearch.toLowerCase()) ||
          listing.industry.toLowerCase().includes(this.marketSearch.toLowerCase())
        )
      },
    },
    mounted() {
      this.fetchBazaarData()
    },
    methods: {
      async fetchBazaarData() {
        try {
          const response = await this.api.get('/api/bazaar/')
          this.availableGains = response.data.available_gains
          this.totalMoqs = response.data.total_moqs
          this.inventory = response.data.inventory
          this.marketListings = response.data.market_listings
          this.userListings = response.data.user_listings
        } catch (error) {
          console.error('Error fetching bazaar data:', error)
        }
      },
      async buyPack(currency) {
        try {
          const response = await this.api.post('/api/bazaar/buy-pack/', { currency })
          
          this.packDialog = true
          this.packOpeningState = 'selecting'
          this.selectedIndustry = null
          this.packStocks = []
          this.visiblePackStocks = []

          await this.delay(2000)
          this.selectedIndustry = response.data.industry
          this.packOpeningState = 'revealing'

          this.triggerConfetti()

          await this.delay(1500)

          this.packStocks = response.data.stocks
          
          for (const stock of this.packStocks) {
            await this.delay(500)
            this.visiblePackStocks.push(stock)
          }

          this.packOpeningState = 'revealed'

          this.fetchBazaarData()
        } catch (error) {
          console.error('Error buying pack:', error)
        }
      },
      delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      buyStock(stock) {
        this.confirmMessage = `Buy ${stock.name} (${stock.symbol}) for $${stock.current_price}?`
        this.confirmAction = async () => {
          try {
            await this.api.post('http://localhost:8000/api/bazaar/buy-stock/', { symbol: stock.symbol })
            this.fetchBazaarData()
            this.confirmDialog = false
          } catch (error) {
            console.error('Error buying stock:', error)
          }
        }
        this.confirmDialog = true
      },
      sellStock(stock) {
        this.confirmMessage = `Sell ${stock.name} (${stock.symbol}) for ${stock.current_price} Moqs?`
        this.confirmAction = async () => {
          try {
            await this.api.post('http://localhost:8000/api/bazaar/sell-stock/', { symbol: stock.symbol })
            this.fetchBazaarData()
            this.confirmDialog = false
          } catch (error) {
            console.error('Error selling stock:', error)
          }
        }
        this.confirmDialog = true
      },
      listStock(stock) {
        // Open a dialog to enter listing price
        // Then call API to list the stock
      },
      buyListedStock(listing) {
        this.confirmMessage = `Buy ${listing.name} (${listing.symbol}) for ${listing.price} Moqs?`
        this.confirmAction = async () => {
          try {
            await this.api.post('http://localhost:8000/api/bazaar/buy-listed-stock/', { listing_id: listing.id })
            this.fetchBazaarData()
            this.confirmDialog = false
          } catch (error) {
            console.error('Error buying listed stock:', error)
          }
        }
        this.confirmDialog = true
      },
      editListing(listing) {
        // Open a dialog to edit listing price
        // Then call API to update the listing
      },
      selectPackStock(stock) {
        this.confirmMessage = `Add ${stock.name} (${stock.symbol}) to your inventory? You can only add 1 stock from each pack.`
        this.confirmAction = async () => {
          try {
            await this.api.post('/api/bazaar/add-to-inventory/', { symbol: stock.symbol })
            this.fetchBazaarData()
            this.packDialog = false
            this.confirmDialog = false
          } catch (error) {
            console.error('Error adding stock to inventory:', error)
          }
        }
        this.confirmDialog = true
      },
      triggerConfetti() {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      },
    },
  }
  </script>