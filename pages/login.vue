<template>
  <v-row>
    <v-col cols="8" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar dark> Login </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              name="email"
              label="email"
              type="email"
              placeholder="Masukan email"
              v-model="form.email"
            >
            </v-text-field>
            <v-text-field
              name="password"
              label="password"
              type="password"
              placeholder="Masukan Password"
              v-model="form.password"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="onSubmit" :disabled="isDisable">
            <span v-if="!isDisable"> Login</span>
            <v-progress-circular v-else color="black" indeterminate>
            </v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
      <p>
        Do you already have an account?
        <v-btn to="/register" plain>Register</v-btn>
      </p>
      <v-alert v-if="isError" color="red lighten-2" dark>{{
        $t(message)
      }}</v-alert>
    </v-col>
  </v-row>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  middleware: ['unauthenticated'],
  data() {
    return {
      isDisable: false,
      message: '',
      isError: false,
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapMutations('auth', {
      setFullname: 'setFullname',
      setAccessToken: 'setAccessToken',
      setRefreshToken: 'setRefreshToken',
    }),
    storeWelcomeScreen() {
      localStorage.setItem('welcomeScreen', true)
    },
    onSubmit() {
      this.isDisable = true

      this.$axios
        .$post('/auth/login', this.form)
        .then((response) => {
          this.isDisable = false
          // Storage Passed Welcome screen
          if (!localStorage.welcomeScreen) {
            this.storeWelcomeScreen()
          }
          // Store Auth Data:
          this.setFullname(response.fullname)
          this.setAccessToken(response.accessToken)
          this.setRefreshToken(response.refreshToken)

          // Redirect To Login page
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          this.isError = true
          this.message = error.response.data.message
          this.isDisable = false
        })
    },
  },
  mounted() {
    if (this.$route.params.message === 'AUTH_REQUIRED') {
      this.message = this.$route.params.message
      this.isError = true
    }
  },
}
</script>
