import Vue from 'vue'
import Vuetify, {
  VBtn, VIcon, VSpacer, VDialog,
  VCard, VCardText, VCardActions, VCardTitle,
  VToolbar, VToolbarTitle  
} from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import ReloadButton from '../components/controls/ReloadButton'

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VBtn, VIcon, VSpacer, VDialog,
    VCard, VCardText, VCardActions, VCardTitle,
    VToolbar, VToolbarTitle,
    ReloadButton
    }
})
