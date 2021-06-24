<template>
  <div id="app">
    <org-picker v-model="selectedOrg"
                :width="400"
                :multipleLimit="2">
    </org-picker>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      selectedOrg: []
    }
  }
}
</script>

<style>
</style>
