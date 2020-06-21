module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'BAAC',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1,maximum-scale=1.0,user-scalable=no'},
      {name: 'applicable-device', content: 'pc,mobile'},
      {hid: 'keywords', name: 'keywords', content: 'BAAC Form Rent Help Transfer Chinese Trade Visa Enjoy Transport Apply Car Other'},
      {hid: 'description', name: 'description', content: '论坛 forum BAAC Rent Help Transfer Chinese Trade Visa Enjoy Transport Application Car Other'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href: '//fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,700,400italic|Material+Icons'
      }
    ],
    script: [
      {src: '//res.wx.qq.com/open/js/jweixin-1.6.0.js'}, /*微信sdk*/
    ]
    // script: [
    //   {src: 'https://hm.baidu.com/hm.js?7467afe0c471cc1773d087a45ae360de'}, /*引入百度统计的js*/
    // ]
    
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#ffffff'},
  /*
  ** Build configuration
  */
  css: [
    {src: '~/assets/styles/base.scss', lang: 'scss'},
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css',
    // 'quill-emoji/dist/quill-emoji.css',
    {src: '~/assets/styles/common.css', lang: 'css'},
    {src: 'vue-material/dist/vue-material.min.css', lang: 'css'},
    {src: '~/assets/styles/theme.scss', lang: 'scss'} // include vue-material theme engine
  ],
  js: [],
  plugins: [
    {
      src: '~plugins/vue-infinite-scroll',
      ssr: false // 只在client被打包引用
    },
    '~/plugins/vue-material',
    '~/plugins/axios',
    '~/plugins/baiduGa',
    '~/plugins/filter',
    // '~/plugins/spanner.js',
    {src: '~plugins/editor.js', ssr: false},
  ],
  router: {
    middleware: [
      // 'i18n',
      'authMiddleware'
    ]
  },
  modules: [
    // 'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
    // '@nuxtjs/auth',
    [
      'nuxt-i18n'
    ]
  ],
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    /* module options */
    theme: {
      themes: {
        light: {
          primary: '#009688'
        }
      }
    }
  },
  axios: {
    proxy: true,

  },
  proxy: {
    '/api': {
      // target: 'http://47.99.207.9:9100',
      // target: 'http://localhost:9100',
      target: process.env.API_ADDR || 'http://47.99.207.9:9100',
      // target: 'https://www.86baac.com/api',
      pathRewrite: {
        '^/api/': '/'
      }
    },
  },
  i18n: {
    locales: [
      {code: 'en', file: 'en.json'},
      {code: 'zh', file: 'zh.json'},
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en'
    },
    langDir: 'locales/',
    lazy: true,
    detectBrowserLanguage: {
      // Set to always redirect to value stored in the cookie, not just once
      alwaysRedirect: true,
    },
  },
  build: {
    /*
    ** Run ESLint on save
    */
    // vendor: ['vue-material'],
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
      }
    }
  }
}
