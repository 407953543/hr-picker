import Vue from 'vue'
import {
  Button,
  Dialog,
  Select,
  Tree,
  Row,
  Col,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
