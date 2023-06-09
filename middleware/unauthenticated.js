export default function ({ store, i18n }) {
  if (store.getters['auth/authenticated']) {
    return window.$nuxt.$router.push({
      name: 'dashboard___' + i18n.locale,
    })
  }
}
