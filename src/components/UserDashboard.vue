<template>
  <v-container fluid class="fill-height pa-0" style="background: linear-gradient(to right, #2196F3, #4CAF50);">
    <v-row align="center" justify="center" class="mx-0">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-6">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">
            {{ username }}'s Dashboard
          </v-card-title>

          <v-card outlined>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Your Portfolio</span>
              <v-btn color="primary" to="/draft">
                <v-icon left>mdi-plus</v-icon>
                Draft Stocks
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="table_headers"
                :items="portfolioWithTotalValue"
                :items-per-page="10"
                show-headers
              >
                <template v-slot:item.stock.symbol="{ item }">
                  <v-chip :color="getRandomColor(item.stock.symbol)" text-color="white" small>
                    {{ item.stock.symbol }}
                  </v-chip>
                </template>
                <template v-slot:item.stock.purchase_price="{ item }">
                  ${{ item.stock.purchase_price.toFixed(2) }}
                </template>
                <template v-slot:item.stock.current_price="{ item }">
                  ${{ item.stock.current_price.toFixed(2) }}
                </template>
                <template v-slot:item.totalValue="{ item }">
                  ${{ item.totalValue.toFixed(2) }}
                </template>
                <template v-slot:item.gain_loss="{ item }">
                  <span :class="item.gain_loss >= 0 ? 'success--text' : 'error--text'">
                    {{ item.gain_loss >= 0 ? '+' : '-' }}${{ Math.abs(item.gain_loss).toFixed(2) }}
                  </span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn small color="error" @click="openSellDialog(item)">Sell</v-btn>
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
                <v-col cols="12" sm="6" md="4">
                  <v-card outlined>
                    <v-card-text class="text-center">
                      <div class="text-h6">Total Gain/Loss</div>
                      <div :class="['text-h4', gainLossColor]">
                        {{ totalGainLoss >= 0 ? '+' : '-' }}${{ Math.abs(totalGainLoss).toFixed(2) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-card outlined>
                    <v-card-text class="text-center">
                      <div class="text-h6">Total Portfolio Value</div>
                      <div class="text-h4">${{ totalPortfolioValue.toFixed(2) }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-card outlined>
                    <v-card-text class="text-center">
                      <div class="text-h6">Available Balance</div>
                      <div class="text-h4 primary--text">${{ balance.toFixed(2) }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="sellDialog" max-width="400px">
      <v-card>
        <v-card-title>Sell Shares</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p>Stock: {{ selectedStock ? selectedStock.stock.symbol : '' }}</p>
              <p>Current Price: ${{ selectedStock ? selectedStock.stock.current_price : 0 }}</p>
              <p>Owned Shares: {{ selectedStock ? selectedStock.quantity : 0 }}</p>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="sellQuantity"
                label="Number of Shares to Sell"
                type="number"
                min="1"
                :max="selectedStock ? selectedStock.quantity : 1"
                :rules="[
                  v => v > 0 || 'Quantity must be greater than 0',
                  v => v <= (selectedStock ? selectedStock.quantity : 0) || 'Cannot sell more shares than owned'
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSellDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="confirmSell">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserDashboard',
  data: () => ({  
    table_headers: [
      { title: 'Ticker', align: 'start', value: 'stock.symbol' },
      { title: 'Name', align: 'start', value: 'stock.name' },
      { title: 'Quantity', align: 'end', value: 'quantity' },
      { title: 'Purchase Price', align: 'end', value: 'stock.purchase_price' },
      { title: 'Current Price', align: 'end', value: 'stock.current_price' },
      { title: 'Total Value', align: 'end', value: 'totalValue' },
      { title: 'Gain/Loss', align: 'end', value: 'gain_loss' },
      { title: 'Actions', align: 'end', value: 'actions', sortable: false},
    ],
    portfolio: [],
    sellDialog: false,
    selectedStock: null,
    sellQuantity: 1,
    balance: 0,
    username: '',
    initialInvestment: 50000, // The starting amount
  }),
  computed: {
    formattedUsername() {
      // Format the username to capitalize the first letter. Add an 's or an ' if it ends in 's'
      if (this.username.endsWith('s')) {
        return this.username.charAt(0).toUpperCase() + this.username.slice(1) + "'";
      } else {
        return this.username.charAt(0).toUpperCase() + this.username.slice(1) + "'s";
      }
    },
    portfolioWithTotalValue() {
      return this.portfolio.map(item => {
        const totalValue = Number(item.quantity) * Number(item.stock.current_price);
        const purchaseValue = Number(item.quantity) * Number(item.stock.purchase_price);
        const gain_loss = totalValue - purchaseValue;
        return {
          ...item,
          totalValue,
          gain_loss,
        };
      });
    },
    totalPortfolioValue() {
      return this.portfolioWithTotalValue.reduce((sum, item) => sum + item.totalValue, 0);
    },
    totalGainLoss() {
      const currentTotalValue = this.totalPortfolioValue + Number(this.balance);
      const gainLoss = currentTotalValue - this.initialInvestment;
      
      return gainLoss;
    },
    gainLossColor() {
      return this.totalGainLoss >= 0 ? 'green--text' : 'red--text';
    }
  },
  mounted() {
    this.fetchPortfolio();
    console.log('Headers:', this.table_headers);
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
        this.portfolio = response.data.stocks.map(stock => ({
          ...stock,
          quantity: Number(stock.quantity),
          stock: {
            ...stock.stock,
            current_price: Number(stock.stock.current_price),
            purchase_price: Number(stock.stock.purchase_price)
          }
        }));
        this.balance = Number(response.data.balance);
        this.username = response.data.user;
        
        this.$nextTick(() => {
          this.$forceUpdate();
        });
        
        console.log('Portfolio:', this.portfolio);
        console.log('Balance:', this.balance);
        console.log('Total Portfolio Value:', this.totalPortfolioValue);
        console.log('Total Gain/Loss:', this.totalGainLoss);
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      }
    },
    getRandomColor(symbol) {
      const colors = ['primary', 'secondary', 'accent', 'success', 'info', 'warning'];
      const index = symbol.charCodeAt(0) % colors.length;
      return colors[index];
    },
    openSellDialog(stock) {
      this.selectedStock = stock;
      this.sellQuantity = 1;
      this.sellDialog = true;
    },
    closeSellDialog() {
      this.sellDialog = false;
      this.selectedStock = null;
      this.sellQuantity = 1;
    },
    async confirmSell() {
      if (this.sellQuantity <= 0 || this.sellQuantity > this.selectedStock.quantity) {
        this.$store.commit('setSnackbar', {
          text: 'Please enter a valid quantity',
          color: 'error'
        });
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/sell/', // Changed from '/api/stocks/sell/'
          { 
            symbol: this.selectedStock.stock.symbol,
            quantity: this.sellQuantity
          },
          { 
            headers: { 
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            } 
          }
        );

        this.$store.commit('setSnackbar', {
          text: `Successfully sold ${this.sellQuantity} shares of ${this.selectedStock.stock.symbol}`,
          color: 'success'
        });

        this.closeSellDialog();
        this.fetchPortfolio(); // Refresh the portfolio
      } catch (error) {
        console.error('Error selling stock:', error.response ? error.response.data : error);
        this.$store.commit('setSnackbar', {
          text: 'Failed to sell stock. Please try again.',
          color: 'error'
        });
      }
    },
  },
}
</script>

<style scoped>
th {
  background-color: red !important;
  color: white !important;
  font-size: 18px !important;
  padding: 10px !important;
}

.green--text {
  color: #4CAF50 !important;
}

.red--text {
  color: #F44336 !important;
}
</style>