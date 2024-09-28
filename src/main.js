import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import store from './store'  // Import your store

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(store)  // Use the store
  .use(vuetify)
  .mount('#app')