import OrgPicker from './OrgPicker'

const components = [
  OrgPicker
]

const install = function (Vue) {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

export default {
    install
}
