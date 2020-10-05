import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
    name: 'Root',
    store,
    render: h => h(App),
}).$mount('#app')
