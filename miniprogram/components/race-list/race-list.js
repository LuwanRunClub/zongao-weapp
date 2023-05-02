const i18n = require("./../../utils/i18n");
// components/race-list/race-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
    showBtn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  pageLifetimes: {
    show: function() {
      this.setData({
        _t: i18n.i18n.translate()
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
