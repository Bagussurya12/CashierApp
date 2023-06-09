<template>
  <v-row class="frame-content">
    <v-col cols="10" offset="1">
      <v-card class="my-3">
        <v-toolbar color="black" dark>
          Users
          <v-spacer> </v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="alert.show" :type="alert.type">
            {{ alert.message }}
          </v-alert>
          <div class="d-flex mb-4">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
            <v-spacer></v-spacer>
            <v-btn to="users/create" color="black" dark elevation="3" small>
              USER <v-icon right>mdi-plus-circle</v-icon>
            </v-btn>
          </div>

          <v-data-table
            :headers="headers"
            :items-per-page="10"
            :server-items-length="totalData"
            :items="users"
            :loading="loading"
            :options.sync="options"
            :search.sync="search"
            :footer-props="{
              itemsPerPageOptions: [10, 20, 30],
            }"
          >
            <template v-slot:top>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title
                    >Hapus Data {{ itemDelete.fullname }}?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" dark text @click="closeDelete">
                      CANCEL</v-btn
                    >
                    <v-btn
                      color="black"
                      dark
                      text
                      @click="deleteConfirm(itemDelete._id)"
                      >DELETE</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn :to="`users/edit/${item._id}`" icon color="black" dark>
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn small icon color="black" dark @click="deleteItem(item)"
                ><v-icon small>mdi-delete</v-icon></v-btn
              >
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      alert: {
        show: false,
        type: '',
        message: '',
      },
      itemDelete: '',
      dialogDelete: false,
      search: '',
      loading: false,
      options: {},
      totalData: 0,
      users: [],
      headers: [
        { text: '#', value: 'row', sortable: false },
        { text: 'Fullname', value: 'fullname', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Role', value: 'role', sortable: false },
        { text: '', value: 'actions', sortable: false },
      ],
      breadcrumbs: [
        {
          text: 'Users',
          disabled: true,
          to: '/users',
        },
      ],
    }
  },
  methods: {
    fetchUser() {
      const { page, itemsPerPage } = this.options
      this.loading = true
      this.$axios
        .$get(`/users?page=${page}&limit=${itemsPerPage}&search=${this.search}`)
        .then((response) => {
          this.loading = false
          this.users = response.users.docs
          this.totalData = response.users.totalDocs

          // let startItem = (page - 1) * itemsPerPage + 1
          let startItem = response.users.pagingCounter
          this.users.map((user) => (user.row = startItem++))
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    deleteItem(item) {
      this.itemDelete = item
      this.dialogDelete = true
    },
    closeDelete() {
      this.dialogDelete = false
    },
    deleteConfirm(id) {
      this.$axios
        .$delete(`/users/${id}`)
        .then((response) => {
          // Process Delete data table

          this.users = this.users.filter((user) => user._id != id)
          let params = {
            message: 'DELETE_SUCCESS',
            fullname: this.itemDelete.fullname,
          }
          this.showAlert(params)
          this.closeDelete()
        })
        .catch((err) => {
          console.log(err)
          this.closeDelete()
        })
    },
    showAlert(params) {
      if (params.message == 'UPDATE_SUCCESS') {
        ;(this.alert.show = true),
          (this.alert.type = 'success'),
          (this.alert.message = this.$t(params.message, {
            title: params.fullname,
          }))
      } else if (params.message == 'DELETE_SUCCESS') {
        ;(this.alert.show = true),
          (this.alert.type = 'success'),
          (this.alert.message = this.$t(params.message, {
            title: params.fullname,
          }))
      } else if (params.message == 'CREATE_SUCCESS') {
        ;(this.alert.show = true),
          (this.alert.type = 'success'),
          (this.alert.message = this.$t(params.message, {
            title: params.fullname,
          }))
      } else if (params.message == 'ID_NOT_FOUND') {
        ;(this.alert.show = true),
          (this.alert.type = 'error'),
          (this.alert.message = this.$t(params.message, {
            title: params.fullname,
          }))
      }
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchUser()
      },
      deep: true,
    },
    search: {
      handler() {
        this.fetchUser()
      },
    },
  },
  mounted() {
    this.showAlert(this.$route.params)
  },
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
