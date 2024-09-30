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
            <v-card outlined class="mb-6" justify="center">
              <v-card-title class="text-center">Buy Packs</v-card-title>
              <v-card-text class="text-center">
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
                  <v-btn small color="success" @click="lockInStock(item)">Lock In</v-btn>
                  <v-btn small color="info" @click="listStock(item)">List</v-btn>
                </template>
              </v-data-table>
            </v-card>
  
            <!-- Bazaar -->
            <v-card outlined>
              <v-tabs v-model="bazaarTab">
                <v-tab value="inventory">Persistent Trade</v-tab>
                <v-tab value="market">Market</v-tab>
                <v-tab value="myListings">My Listings</v-tab>
              </v-tabs>
              <v-window v-model="bazaarTab">
                <v-window-item value="inventory">
                  <v-data-table
                    :headers="persistentTradeHeaders"
                    :items="persistentTradeStocks"
                    :items-per-page="5"
                    class="elevation-1"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn small color="success" @click="buyPersistentStock(item)">Buy</v-btn>
                      <v-btn small color="error" @click="sellPersistentStock(item)">Sell</v-btn>
                    </template>
                  </v-data-table>

                  <!-- Buy/Sell Dialog -->
                  <v-dialog v-model="tradeDialog" max-width="400px">
                    <v-card>
                      <v-card-title>{{ tradeAction }} {{ selectedStock.symbol }}</v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="tradeQuantity"
                          label="Quantity"
                          type="number"
                        ></v-text-field>
                        <v-text-field
                          v-model="tradeMoqs"
                          label="Moqs"
                          type="number"
                          readonly
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeTradeDialog">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="confirmTrade">Confirm</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
                <v-window-item value="market">
                  <v-data-table
                    :headers="marketHeaders"
                    :items="marketListings"
                    :items-per-page="5"
                    class="elevation-1"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        small
                        color="success"
                        @click="buyMarketStock(item)"
                        :disabled="username === item.seller"
                      >
                        Buy
                      </v-btn>
                    </template>
                  </v-data-table>

                  <!-- Buy Market Stock Dialog -->
                  <v-dialog v-model="buyMarketDialog" max-width="400px">
                    <v-card>
                      <v-card-title>Buy Market Stock</v-card-title>
                      <v-card-text v-if="selectedStock">
                        <p>Are you sure you want to buy {{ selectedStock.symbol }} for {{ selectedStock.price }} Moqs?</p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeBuyMarketDialog">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="confirmBuyMarketStock">Confirm</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
                <v-window-item value="myListings">
                  <v-data-table
                    :headers="myListingsHeaders"
                    :items="myListings"
                    :items-per-page="5"
                    class="elevation-1"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        small
                        color="primary"
                        @click="editListing(item)"
                        class="mr-2"
                      >
                        Edit
                      </v-btn>
                      <v-btn
                        small
                        color="error"
                        @click="cancelListing(item)"
                      >
                        Remove
                      </v-btn>
                    </template>
                  </v-data-table>

                  <!-- Edit Listing Dialog -->
                  <v-dialog v-model="editListingDialog" max-width="400px">
                    <v-card>
                      <v-card-title>Edit Listing for {{ selectedListing.symbol }}</v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="editListingPrice"
                          label="Price (MOQs)"
                          type="number"
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeEditListingDialog">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="confirmEditListing">Confirm</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
              </v-window>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Pack Opening Dialog -->
      <v-dialog v-model="packDialog" max-width="600px" persistent>
        <v-card>
          <v-card-title class="text-h5" style="text-align: center;">Pack Opening!</v-card-title>
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
                <span class="text-h6" style="text-align: center;">Selecting Industry...</span>
                </br>
                <v-spacer class="my-4"></v-spacer>
              </v-row>
            <v-spacer class="my-4"></v-spacer>
            </v-container>
            <v-container v-else-if="packOpeningState === 'revealing' || packOpeningState === 'revealed'">
              <v-row justify="center">
                <span class="text-h6">{{ selectedIndustry }}</span>
              </v-row>
              <v-row justify="center">
              <v-data-table
                v-if="visiblePackStocks.length > 0"
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
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="packDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Buy Persistent Stock Dialog -->
    <v-dialog v-model="buyPersistentDialog" max-width="400px">
    <v-card>
        <v-card-title>Buy Persistent Stock</v-card-title>
        <v-card-text>
        <v-row>
            <v-col cols="12">
            <p>Stock: {{ selectedStock ? selectedStock.name : '' }}</p>
            <p>Current Price: ${{ selectedStock ? Number(selectedStock.current_price).toFixed(2) : '0.00' }}</p>
            </v-col>
            <v-col cols="12">
            <v-text-field
                v-model.number="buyQuantity"
                label="Number of Shares"
                type="number"
                min="1"
                :rules="[v => v > 0 || 'Quantity must be greater than 0']"
            ></v-text-field>
            </v-col>
            <v-col cols="12">
            <p class="font-weight-bold">Total Cost: ${{ (selectedStock ? selectedStock.current_price * buyQuantity : 0).toFixed(2) }}</p>
            <p :class="{'error--text': selectedStock && selectedStock.current_price * buyQuantity > availableGains}">
                Remaining Gains: ${{ (availableGains - (selectedStock ? selectedStock.current_price * buyQuantity : 0)).toFixed(2) }}
            </p>
            </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="buyPersistentDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="confirmBuyPersistentStock" :disabled="!canBuyPersistent">Confirm</v-btn>
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

      <!-- Sell Persistent Stock Dialog -->
    <v-dialog v-model="sellPersistentDialog" max-width="400px">
    <v-card>
        <v-card-title>Sell Persistent Stock</v-card-title>
        <v-card-text>
        <v-row>
            <v-col cols="12">
            <p>Stock: {{ selectedStock ? selectedStock.name : '' }}</p>
            <p>Current Price: ${{ selectedStock ? Number(selectedStock.current_price).toFixed(2) : '0.00' }}</p>
            <p>Available Quantity: {{ selectedStock ? selectedStock.quantity : 0 }}</p>
            </v-col>
            <v-col cols="12">
            <v-text-field
                v-model.number="sellQuantity"
                label="Number of Shares to Sell"
                type="number"
                min="1"
                :max="selectedStock ? selectedStock.quantity : 0"
                :rules="[v => v > 0 || 'Quantity must be greater than 0', v => v <= (selectedStock ? selectedStock.quantity : 0) || 'Cannot sell more than you own']"
            ></v-text-field>
            </v-col>
            <v-col cols="12">
            <p class="font-weight-bold">Total Moqs to Receive: {{ (selectedStock ? selectedStock.current_price * sellQuantity : 0).toFixed(2) }}</p>
            </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="sellPersistentDialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="confirmSellPersistentStock" :disabled="!canSellPersistent">Confirm</v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
  
      <!-- Add this dialog for listing a stock -->
      <v-dialog v-model="listingDialog" max-width="400px">
        <v-card>
          <v-card-title>List Stock</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="listingPrice"
              label="Price (in MOQs)"
              type="number"
              min="1"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="listingDialog = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="confirmListStock">List</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>

  import { mapState } from 'vuex'
  import { inject } from 'vue'
  import confetti from 'canvas-confetti'
  import { VTabs, VTab, VListItem } from 'vuetify/components'
  import { ref, reactive } from 'vue';
  const buyMarketDialog = ref(false);
  export default {
    name: 'BazaarPage',
    components: {
      VTabs,
      VTab
    },
    setup() {
      const api = inject('api')
      const myListingsHeaders = [
        { text: 'Symbol', value: 'symbol' },
        { text: 'Name', value: 'name' },
        { text: 'Listing Price', value: 'price' },
        { text: 'Actions', value: 'actions', sortable: false },
        ];

      const myListings = ref([]);
      const editListingDialog = ref(false);

      return { api, myListingsHeaders, myListings, editListingDialog }
    },
    data: () => ({
      availableGains: 0,
      totalMoqs: 0,
      packPriceGains: 1000,
      packPriceMoqs: 100,
      inventory: [],
      buyPersistentDialog: false,
  buyQuantity: 1,
  selectedStock: null,
      marketListings: [],
      editListingPrice: 0,
      userListings: [],
      persistentPortfolio: [],
      bazaarTab: null,
      marketSearch: '',
      packDialog: false,
      selectedIndustry: null,
      buyMarketDialog: false,
      packStocks: [],
      visiblePackStocks: [],
      sellPersistentDialog: false,
      sellQuantity: 1,
      confirmDialog: false,
      buyMarketDialog: false,
      editListingDialog: false,
      username: '',
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
        { title: 'Symbol', value: 'symbol' },
        { title: 'Name', value: 'name' },
        { title: 'Current Price', value: 'current_price' },
        { title: 'Action', value: 'action', sortable: false }
      ],
      listingDialog: false,
      listingPrice: null,
      stockToList: null,
      persistentTradeHeaders: [
        { title: 'Symbol', value: 'symbol' },
        { title: 'Name', value: 'name' },
        { title: 'Quantity', value: 'quantity' },
        { title: 'Current Price', value: 'current_price' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      persistentTradeStocks: [],
      tradeDialog: false,
      selectedStock: null,
      tradeAction: '',
      tradeQuantity: 1,
    }),
    computed: {
        canBuyPersistent() {
            return this.buyQuantity > 0 && this.selectedStock && 
                this.selectedStock.current_price * this.buyQuantity <= this.availableGains;
        },
      filteredMarketListings() {
        return this.marketListings.filter(listing =>
          listing.symbol.toLowerCase().includes(this.marketSearch.toLowerCase()) ||
          listing.name.toLowerCase().includes(this.marketSearch.toLowerCase()) ||
          listing.industry.toLowerCase().includes(this.marketSearch.toLowerCase())
        )
      },
      canSellPersistent() {
      return this.sellQuantity > 0 && this.selectedStock && 
           this.sellQuantity <= this.selectedStock.quantity;
  }
    },
    mounted() {
      this.fetchBazaarData()
      this.fetchPortfolio()
    },
    methods: {
      async fetchBazaarData() {
        try {
          const response = await this.api.get('/api/bazaar/')
          this.availableGains = response.data.available_gains
          this.totalMoqs = response.data.total_moqs
          this.inventory = response.data.inventory
          this.marketListings = response.data.market_listings
          console.log(this.marketListings)
          this.myListings = response.data.user_listings
          this.persistentTradeStocks = response.data.persistent_portfolio
        } catch (error) {
          console.error('Error fetching bazaar data:', error)
        }
      },
      async fetchPortfolio() {
        const token = localStorage.getItem('token');
        const response = await this.api.get('/api/portfolio/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        this.username = response.data.user;
        
      },
      async buyPack(currency) {
        try {
          const response = await this.api.post('/api/bazaar/buy-pack/', { currency })
          console.log(response.data)
          this.packDialog = true
          this.packOpeningState = 'selecting'
          this.selectedIndustry = null
          this.packStocks = []
          this.visiblePackStocks = []

          // Delay to simulate "selecting" state
          await this.delay(2000)

          // Reveal the industry
          this.selectedIndustry = response.data.industry
          this.packOpeningState = 'revealing'

          // Trigger confetti after revealing the industry
          this.triggerConfetti()

          // Delay before starting to reveal stocks
          await this.delay(1500)

          // Store all stocks from the response
          this.packStocks = response.data.stocks
          console.log(this.packStocks)
          // Reveal stocks one by one
          for (const stock of this.packStocks) {
            await this.delay(500) // Delay between each stock reveal
            this.visiblePackStocks.push(stock)
          }

          // All stocks revealed
          this.packOpeningState = 'revealed'
          
          // Refresh bazaar data after buying a pack
          await this.fetchBazaarData()
        } catch (error) {
          console.error('Error buying pack:', error)
        }
      },
      delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      buyPersistentStock(stock) {
        this.selectedStock = stock;
        this.buyQuantity = 1;
        this.buyPersistentDialog = true;
        },
        async confirmBuyPersistentStock() {
            if (this.buyQuantity <= 0) {
                this.$store.commit('setSnackbar', {
                text: 'Please enter a valid quantity',
                color: 'error'
                });
                return;
            }

            const totalCost = this.selectedStock.current_price * this.buyQuantity;
            if (totalCost > this.availableGains) {
                this.$store.commit('setSnackbar', {
                text: 'Insufficient funds to complete this purchase',
                color: 'error'
                });
                return;
            }

            try {
                await this.api.post('/api/persistent-portfolio/buy/', {
                symbol: this.selectedStock.symbol,
                quantity: this.buyQuantity
                });
                this.$store.commit('setSnackbar', {
                text: `Successfully bought ${this.buyQuantity} shares of ${this.selectedStock.symbol}`,
                color: 'success'
                });
                this.buyPersistentDialog = false;
                await this.fetchBazaarData();
            } catch (error) {
                console.error('Error buying persistent stock:', error);
                this.$store.commit('setSnackbar', {
                text: 'Failed to buy stock',
                color: 'error'
                });
            }
        },
      listStock(stock) {
        this.stockToList = stock;
        this.listingPrice = null;
        this.listingDialog = true;
      },
      async confirmListStock() {
        if (!this.listingPrice || this.listingPrice <= 0) {
          this.$store.commit('setSnackbar', {
            text: 'Please enter a valid price',
            color: 'error'
          });
          return;
        }

        try {
          const response = await this.api.post('/api/bazaar/list-stock/', {
            symbol: this.stockToList.symbol,
            price: this.listingPrice
          });
          this.$store.commit('setSnackbar', {
            text: 'Stock listed successfully',
            color: 'success'
          });
          this.listingDialog = false;
          await this.fetchBazaarData();
        } catch (error) {
          console.error('Error listing stock:', error);
          this.$store.commit('setSnackbar', {
            text: 'Failed to list stock',
            color: 'error'
          });
        }
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
        this.editListingDialog = true;
        this.selectedListing = listing;
        this.editListingPrice = listing.price; // Pre-fill the price field
      },
      async confirmEditListing() {
        if (!this.editListingPrice || this.editListingPrice <= 1) {
          this.$store.commit('setSnackbar', {
            text: 'Please enter a valid price',
            color: 'error'
          });
          console.log(this.editListingPrice)
          return;
        }

        try {
          const response = await this.api.put(`/api/bazaar/edit-listing/${this.selectedListing.id}/`, {
            price: this.editListingPrice // Use editListingPrice here
          });
          this.$store.commit('setSnackbar', {
            text: 'Listing updated successfully',
            color: 'success'
          });
          this.editListingDialog = false;
          await this.fetchBazaarData();
        } catch (error) {
          console.error('Error editing listing:', error);
          this.$store.commit('setSnackbar', {
            text: 'Failed to update listing',
            color: 'error'
          });
        }
      },
      closeEditListingDialog() {
        this.editListingDialog = false
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
      sellPersistentStock(stock) {
    this.selectedStock = stock;
    this.sellQuantity = 1;
    this.sellPersistentDialog = true;
  },

  async confirmSellPersistentStock() {
    if (!this.canSellPersistent) {
      this.$store.commit('setSnackbar', {
        text: 'Invalid sell quantity',
        color: 'error'
      });
      return;
    }

    try {
      const response = await this.api.post('/api/persistent-portfolio/sell/', {
        symbol: this.selectedStock.symbol,
        quantity: this.sellQuantity
      });
      
      this.$store.commit('setSnackbar', {
        text: `Successfully sold ${this.sellQuantity} shares of ${this.selectedStock.symbol} for ${response.data.moqs_received} Moqs`,
        color: 'success'
      });
      
      this.sellPersistentDialog = false;
      await this.fetchBazaarData();
    } catch (error) {
      console.error('Error selling persistent stock:', error);
      this.$store.commit('setSnackbar', {
        text: 'Failed to sell stock',
        color: 'error'
      });
        }
      },
      async lockInStock(stock) {
        try {
            const response = await this.api.post('/api/persistent-portfolio/lock-in/', {
            symbol: stock.symbol,
            quantity: 1
            });
            this.$store.commit('setSnackbar', {
            text: 'Stock locked in successfully',
            color: 'success'
            });
            await this.fetchBazaarData();
        } catch (error) {
            console.error('Error locking in stock:', error);
            this.$store.commit('setSnackbar', {
            text: 'Failed to lock in stock',
            color: 'error'
            });
        }
        },
      async cancelListing(listing) {
        try {
          const response = await this.api.post('/api/bazaar/cancel-listing/', {
            listing_id: listing.id
          });
          this.$store.commit('setSnackbar', {
            text: 'Listing cancelled successfully',
            color: 'success'
          });
          await this.fetchBazaarData();
        } catch (error) {
          console.error('Error cancelling listing:', error);
          this.$store.commit('setSnackbar', {
            text: 'Failed to cancel listing',
            color: 'error'
          });
        }
      },
      buyMarketStock(item) {
        this.selectedStock = item;
        this.buyMarketDialog = true;
      },
      async confirmBuyMarketStock() {
        if (!this.selectedStock) {
            this.$store.commit('setSnackbar', {
            text: 'No stock selected',
            color: 'error'
            });
            return;
        }

        const payload = {
            listing_id: this.selectedStock.id
        };
        console.log('Buy market stock payload:', payload);

        try {
            const response = await this.api.post('/api/bazaar/buy-listed-stock/', payload);
            this.$store.commit('setSnackbar', {
            text: 'Stock purchased successfully',
            color: 'success'
            });
            this.buyMarketDialog = false;
            await this.fetchBazaarData();
        } catch (error) {
            console.error('Error buying market stock:', error.response?.data || error);
            const errorMessage = error.response?.data?.error || 'Failed to buy stock';
            this.$store.commit('setSnackbar', {
            text: errorMessage,
            color: 'error'
            });
        }
        },
      closeBuyMarketDialog() {
        this.buyMarketDialog = false;
        this.selectedStock = null;
      },
    },
  }
  </script>