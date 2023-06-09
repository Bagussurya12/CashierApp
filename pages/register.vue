<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar dark><h2>Register</h2> </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              name="fullname"
              label="fullname"
              type="text"
              placeholder="Masukan Nama Lengkap"
              :rules="rules.fullname"
              v-model="form.fullname"
            >
            </v-text-field>
            <v-text-field
              name="email"
              label="email"
              type="email"
              placeholder="Masukan email"
              :rules="rules.email"
              v-model="form.email"
              @keydown="checkEmaiExist"
            >
            </v-text-field>
            <v-text-field
              name="password"
              label="password"
              type="password"
              placeholder="Masukan Password"
              :rules="rules.password"
              v-model="form.password"
            >
            </v-text-field>
            <v-text-field
              name="retype_password"
              label="retype_password"
              type="password"
              placeholder="Masukan Ulang Password"
              :rules="rules.retype_password"
              v-model="form.retype_password"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="onSubmit" :disabled="isDisable">
            <span v-if="!isDisable"> Register</span>
            <v-progress-circular v-else color="black" indeterminate>
            </v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
      <p>
        Do You Have Ready Account?
        <v-btn to="/login" class="pl-0" plain> Login</v-btn>
      </p>
    </v-col>
  </v-row>
</template>
<script>
export default {
  mmiddleware: ['unauthenticated'],
  data() {
    return {
      emailExist: false,
      isDisable: false,
      form: {
        fullname: '',
        email: '',
        password: '',
        retype_password: '',
      },
      rules: {
        fullname: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Nama Lengkap' }),
        ],
        email: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Email' }),
          (v) => /.+@.+/.test(v) || this.$t('EMAIL_INVALID'),
          (V) => !this.emailExist || this.$t('EMAIL_EXIST'),
        ],
        password: [
          (v) => !!v | this.$t('FIELD_REQUIRED', { field: 'Password' }),
          (v) =>
            v.length >= 6 ||
            this.$t('FIELD_MIN', { field: 'Password', min: 6 }),
        ],
        retype_password: [
          (v) =>
            v === this.form.password ||
            this.$t('FIELD_CONFIRM', {
              field: 'Password',
              confirm: 'Re-Password',
            }),
        ],
      },
    }
  },
  methods: {
    checkEmaiExist() {
      this.emailExist = false
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisable = true
        this.$axios
          .$post('/auth/register', this.form)
          .then((response) => {
            this.isDisable = false
            // Redirect to Login Page
            this.$router.push('/login')
          })
          .catch((error) => {
            if (error.response.data.message == 'EMAIL_EXIST') {
              this.emailExist = true
              this.$refs.form.validate()
            }
            this.isDisable = false
          })
      }
    },
  },
}
</script>
