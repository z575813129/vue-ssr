
export default function (ctx) {
  // const that = this
  const { $axios, store } = ctx
  // if (process.client) {
  //   const accessToken = global.localStorage.getItem('accessToken')
  //   if (accessToken && accessToken !== '0') {
  //     store.commit('login', { accessToken })
  //   }
  // }
  ctx.$axios.onRequest(config => {
    if (store) {
      const {isAuth, accessToken} = store.state
      if (isAuth && accessToken) {
        if (!config.headers) config.headers = {};
        config.headers['Authorization'] = accessToken;
      }
    }

  })
  $axios.onResponseError(err => {
    // console.error(err)
    if (err.response) {
      if (err.response.status == 401) {
        store.dispatch('logout')
      } else if (err.response.status == 400) {
        const data = err.response.data
        console.error(data)
        if (data && data.code && process.client) {
          store.commit('SHOW_TOAST', {show: true, content: data.msg || 'SYSTEM ERROR'})
        }
      } else if (err.response.status == 403) {
        if (process.client) {
          store.commit('SHOW_TOAST', {show: true, content: 'Forbidden'})
        }
      } else {
        if (process.client) {
          store.commit('SHOW_TOAST', {show: true, content: 'SYSTEM ERROR'})
        }
      }
    }
  })
}
