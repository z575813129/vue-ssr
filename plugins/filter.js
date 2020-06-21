import Vue from 'vue'
import formDate from 'date-fns/format'

Vue.filter('dateFormat', function (value, type) {
  // 返回处理后的值
  return formDate(value, type)
})
