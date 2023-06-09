export const state = () => ({
  items: [],
  additionals: [
    {
      title: 'Tax',
      mode: 'percentage',
      value: 10,
    },
    {
      title: 'Service Charge',
      mode: 'fix',
      value: 50000,
    },
  ],
})
export const getters = {
  cartItems: (state, getters, rootState) => {
    return state.items.map(({ id, quantity }) => {
      let product = rootState.products.products.find(
        (product) => product._id === id
      )
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
      }
    })
  },
  itemTotal: () => (price, quantity) => {
    return price * quantity
  },
  subTotal: (state, getters) => {
    return getters.cartItems.reduce((total, item) => {
      return total + getters.itemTotal(item.price, item.quantity)
    }, 0)
  },
  calculatePercentage: (state, getters) => (value) => {
    return (getters.subTotal * value) / 100
  },
  sumAdditional: (state, getters) => {
    if (state.additionals.length) {
      return state.additionals.reduce((total, item) => {
        if (item.mode === 'percentage') {
          return total + getters.calculatePercentage(item.value)
        }
        return total + item.value
      }, 0)
    }
  },
  total: (state, getters) => {
    return getters.subTotal + getters.sumAdditional
  },
}
export const mutations = {
  addItem(state, id) {
    state.items.push({
      id: id,
      quantity: 1,
    })
  },
  incrementItem(state, id) {
    state.items.find((item) => item.id === id).quantity++
  },
  decrementItem(state, id) {
    let item = state.items.find((item) => item.id === id)
    if (item.quantity > 1) {
      item.quantity--
    }
  },
  removeItem(state, id) {
    let index = state.items.findIndex((item) => item.id === id)
    console.log(index, state.items)
    state.items.splice(index, 1)
  },
}

export const actions = {
  addToCart({ commit, state }, id) {
    const found = state.items.find((item) => item.id === id)
    if (found) {
      commit('incrementItem', id)
    } else {
      commit('addItem', id)
    }
  },
  increment({ commit }, id) {
    commit('incrementItem', id)
  },
  decrement({ commit }, id) {
    commit('decrementItem', id)
  },
  remove({ commit }, id) {
    commit('removeItem', id)
  },
}
