export default function (ctx) {
  const {store, redirect, route} = ctx
  // console.log(route)
  if (needAuth(route.meta)) {
    // console.log(store.state)
    store.dispatch('checkAuth')

  }

}

function needAuth(meta) {
  for(let i=0;i<meta.length; i++) {
    const element = meta[i]
    if (element && element['requireAuth']) {
      return true
    }
  }
  return false
}
