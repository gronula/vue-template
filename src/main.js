import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import PromisesBus from '@/utils/PromisesBus'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()
Vue.prototype.$promises = new PromisesBus()

new Vue({
    name: 'Root',
    store,
    render: h => h(App),
}).$mount('#app')
