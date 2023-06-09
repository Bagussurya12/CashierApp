<template>
  <v-row>
    <v-col cols="8" class="frame-content px-6">
      <product></product>
    </v-col>

    <v-col cols="4" class="frame-content white">
      <h2>Orders</h2>
      <order></order>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
}
</script>
<style scoped>
.frame-content {
  height: 90vh;
  overflow-y: auto;
}
.frame-content::-webkit-scrollbar {
  width: 5px;
}
.frame-content::-webkit-scrollbar-track {
  background-color: #fff6f6;
  border-radius: 100px;
}
.frame-content::-webkit-scrollbar-track-thumb {
  background-color: #dbdbdb;
  border-radius: 100px;
}
</style>

<script>
export default {
  middleware: ['authenticated'],
}
</script>
