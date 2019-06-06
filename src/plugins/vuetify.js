import Vue from 'vue'
import Vuetify, {
  VBtn, VIcon, VSpacer, VDialog,
  VCard, VCardText, VCardActions, VCardTitle,
  VToolbar, VToolbarTitle  
} from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VBtn, VIcon, VSpacer, VDialog,
    VCard, VCardText, VCardActions, VCardTitle,
    VToolbar, VToolbarTitle    
    }
})
