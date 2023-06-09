<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card class="mb-2">
        <v-toolbar dark> Dashboard </v-toolbar>
        <v-card-text>
          <h2>Hello $nama</h2>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ['authenticated'],
}
</script>
