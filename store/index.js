export const state = () => {

  return {
    isAuth: false,
    accessToken: '',
    password: '',
    userInfo: {
      email: '',
      username: '',
      avatar: '',
      isEmailVerify: false,
      gender: 0
    },
    needVerifyEmail: true,
    toast: {show: false, type: '', content: ''},
    innerHeight: '',
    msgCount: 0,
    categories: [
      {
        code: 'Rent',
        src: require('~/assets/categoryIcon/Rent.png')
      },
      {
        code: 'Transfer',
        src: require('~/assets/categoryIcon/Transfer.png')
      },
      {
        code: 'Chinese',
        src: require('~/assets/categoryIcon/Chinese.png')
      },
      {
        code: 'Trade',
        src: require('~/assets/categoryIcon/Trade.png')
      },
      {
        code: 'Visa',
        src: require('~/assets/categoryIcon/Visa.png')
      },
      {
        code: 'Enjoy',
        src: require('~/assets/categoryIcon/Enjoy.png')
      },
      {
        code: 'Transport',
        src: require('~/assets/categoryIcon/Transport.png')
      },
      {
        code: 'Apply',
        src: require('~/assets/categoryIcon/Application.png')
      },
      {
        code: 'Car',
        src: require('~/assets/categoryIcon/Car.png')
      },
      {
        code: 'Other',
        src: require('~/assets/categoryIcon/Other.png')
      },
    ],
  }
}
export const mutations = {
  innerHeight(state, payload) {
    state.innerHeight = payload
  },
  login(state, payload) {
    // console.log('state',state)
    if (payload && payload.accessToken) {
      // localStorage.setItem('accessToken', payload.accessToken)
      state.isAuth = true
      state.password = payload.password
      state.accessToken = payload.accessToken
      // this.$axios.setToken(payload.accessToken)
    }
  },
  logout(state) {
    // localStorage.removeItem('accessToken')

    state.isAuth = false
    state.accessToken = ''
    // this.$axios.setToken('')
  },
  userInfo(state, payload) {
    state.userInfo = Object.assign(state.userInfo, payload)
  },
  updateMsgCount(state, payload) {
    state.msgCount=payload
  },
  SHOW_TOAST(state, payload) {
    state.toast = payload
    setTimeout(() => {
      this.commit('HIDE_TOAST')
    }, 2000)
  },
  HIDE_TOAST(state) {
    state.toast.show = false
  },
  ignoreEmailVerify(state) {
    state.needVerifyEmail = false
  },
}

export const actions = {
  async nuxtServerInit({commit, dispatch}, {app}) {
    // console.log(app.$cookies)
    // 初始化用户状态
    const accessToken = app.$cookies.get('accessToken')
    if (accessToken && accessToken !== '0') {
      commit('login', {accessToken})
      try {
        await dispatch('userInfo')
      } catch (err) {
        console.error(err)
      }

      // await dispatch('checkAuth')
    }
  },
  async login({commit, dispatch}, payload) {
    console.log(payload)
    if (payload && payload.accessToken) {
      this.$cookies.set('accessToken', payload.accessToken, {
        maxAge: 60 * 60 * 24 * 24,
        path: '/'
      })
      // const expires = new Date(Date.now()+1000* 60 * 60 * 24 * 3)
      // console.log(expires)
      // this.$cookies.set('accessToken', payload.accessToken, {
      //   expires: expires
      // })
      // this.$cookies.set('accessToken', payload.accessToken)
      commit('login', payload)
      await dispatch('userInfo')
    }
  },
  async fetchMsgCount({commit,state}) {
    console.log('开始获取未读消息数：'+ new Date())
    if (!state.isAuth) {
      return
    }
    try {
      let {data} = await this.$axios.get('/api/v2/my/countMyUnreadMessage')
        
      data = parseInt(data) || 0
      if (data>=100) {
        data= 99
      }
      if (data <0) {
        data = 0
      }
      commit('updateMsgCount', data)
      
    } catch (err) {
      // console.error(err)
    }
  },
  async userInfo({commit,state, dispatch}, payload) {
    if (!state.isAuth) {
      return
    }
    try {
      const {data} = await this.$axios.post('/api/v2/profile/fetchInfo', {})
      
        // const { username, email, isEmailVerify, avatar, gender } = data
      commit('userInfo', data)
      // await dispatch('fetchMsgCount')
      
    } catch (err) {
      // console.error(err.message)
    }
    
  },
  checkAuth({state}) {
    try {
      // console.log(config)
      const {userInfo: {email, isEmailVerify}, isAuth, needVerifyEmail} = state
      const {redirect, route} = this.app.context
      if (!isAuth) {
        redirect('/auth/login', {
          redirect: route.fullPath
        })
      } else if (needVerifyEmail) {
        if (!email || isEmailVerify == 0) {
          // console.log(email)
          // console.log(route.name)
          // console.log(route)
          if (route.name && route.name.includes('verifyEmail'))
            return
          redirect('/auth/verifyEmail', {
            redirect: route.fullPath
          })
        }
      }
    } catch(err) {
      console.error(err)
    }
    

  },
  logout({commit}) {
    this.$cookies.remove('accessToken')
    commit('logout')
    commit('userInfo', null)
  }
}
