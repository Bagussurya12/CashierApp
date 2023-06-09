<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar dark><h2>Edit User</h2> </v-toolbar>
        <v-card-text>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
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
            <v-select
              v-model="form.role"
              :items="roles"
              label="Role"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="onSubmit" :disabled="isDisable">
            <span v-if="!isDisable"> UPDATE </span>
            <v-progress-circular v-else color="black" indeterminate>
            </v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  mmiddleware: ['unauthenticated'],
  asyncData({ params }) {
    return {
      id: params.id,
    }
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'users', to: '/users', disabled: false, exact: true },
        { text: 'create', disabled: true },
      ],
      emailExist: false,
      isDisable: false,
      roles: ['employee', 'cashier', 'admin'],
      form: {
        fullname: '',
        email: '',
        password: '',
        retype_password: '',
        role: '',
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
          (v) =>
            // v.length == 0 ||
            // !!v | this.$t('FIELD_REQUIRED', { field: 'Password' }),
            (v) =>
              v.length == 0 ||
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
        role: [(v) => !!v || this.$t('FIELD_REQUIRED', { field: 'ROLE' })],
      },
    }
  },
  methods: {
    checkEmaiExist() {
      this.emailExist = false
    },
    fetchData() {
      this.$axios
        .$get(`/users/${this.id}`)
        .then((response) => {
          ;(this.form.fullname = response.user.fullname),
            (this.form.email = response.user.email),
            (this.form.role = response.user.role)
        })
        .catch((erorr) => {
          console.log(erorr.response.data.message)
          this.$router.push({
            name: 'users___' + this.$i18n.locale,
            params: {
              message: 'ID_NOT_FOUND',
            },
          })
        })
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisable = true
        this.$axios
          .$put(`/users/${this.id}`, this.form)
          .then((response) => {
            this.isDisable = false

            // Redirect to Login Page
            this.$router.push({
              name: 'users___' + this.$i18n.locale,
              params: {
                message: 'UPDATE_SUCCESS',
                fullname: this.form.fullname,
              },
            })
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
  mounted() {
    this.fetchData()
  },
}
</script>
