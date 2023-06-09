import jwt_decode from 'jwt-decode'

export const state = () => ({
  access_token: null,
  refresh_token: null,
  fullname: null,
})
export const getters = {
  authenticated: (state) => {
    if (state.access_token) {
      return true
    }
    return false
  },
  user: (state) => {
    if (state.access_token) {
      return jwt_decode(state.access_token)
    }
    return false
  },
}

export const mutations = {
  setAccessToken(state, access_token) {
    state.access_token = access_token
  },
  setRefreshToken(state, refresh_token) {
    state.refresh_token = refresh_token
  },
  setFullname(state, fullname) {
    state.fullname = fullname
  },
  logout(state) {
    state.access_token = null
    state.refresh_token = null
    state.fullname = null
  },
}
