export default function ({ store, i18n }) {
  if (!store.getters['auth/authenticated']) {
    return window.$nuxt.$router.push({
      name: 'login___' + i18n.locale,
      params: { message: 'AUTH_REQUIRED' },
    })
  }
}
