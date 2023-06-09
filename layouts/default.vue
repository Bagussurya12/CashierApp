<template>
  <v-app>
    <v-navigation-drawer
      disable-resize-watcher
      v-model="sideDrawer"
      fixed
      app
      dark
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in sideMenu"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fill-height fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-bottom-navigation horizontal height="10vh" fixed dark app>
      <v-app-bar-nav-icon
        @click.stop="sideDrawer = !sideDrawer"
        v-ripple="false"
        plain
      />
      <v-btn
        v-for="(item, i) in bottomMenu"
        :key="i"
        :to="item.to"
        v-ripple="false"
        plain
      >
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
      <v-spacer />
    </v-bottom-navigation>
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',

  data() {
    return {
      sideDrawer: false,
      // fixed: false,
      sideMenu: [],
      originalSideMenu: [
        {
          icon: 'mdi-view-dashboard-variant',
          title: 'Dashboard',
          to: '/dashboard',
          middleware: ['authenticated'],
        },
        {
          icon: 'mdi-application',
          title: 'Cashier App',
          to: '/',
          middleware: ['admin', 'cashier'],
        },
        {
          icon: 'mdi-account',
          title: 'User Management',
          to: '/users',
          middleware: ['admin'],
        },
        {
          icon: 'mdi-fingerprint',
          title: 'Absence',
          to: '/absence',
          middleware: ['authenticated'],
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/login',
          middleware: ['unauthenticated'],
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          to: '/logout',
          middleware: ['authenticated'],
        },
      ],
      bottomMenu: [
        {
          icon: 'mdi-application',
          title: 'App Cashier',
          to: '/',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('auth', {
      authenticated: 'authenticated',
      users: 'user',
    }),
  },
  methods: {
    isWelcomeScreen() {
      if (!localStorage.welcomeScreen) {
        if (
          this.$router.currentRoute.path != '/register' &&
          this.$router.currentRoute.path != '/login'
        ) {
          this.$router.push('/register')
        }
      }
    },
    filterSideMenu() {
      this.sideMenu = this.originalSideMenu.filter((item) => {
        if (item.middleware.includes(this.users.role)) {
          return true
        }
        if (this.authenticated) {
          return item.middleware.includes('authenticated')
        } else {
          return item.middleware.includes('unauthenticated')
        }
      })
    },
  },
  watch: {
    $route() {
      this.isWelcomeScreen()
    },
    authenticated() {
      this.filterSideMenu()
    },
  },
  mounted() {
    this.isWelcomeScreen()
    console.log(this.users)
    this.filterSideMenu()
  },
}
</script>
