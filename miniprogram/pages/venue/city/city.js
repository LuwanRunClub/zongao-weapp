import { getCityList } from "../../../api/venue"
<<<<<<< HEAD
import config from "../../../config/config";
const i18n = require("./../../../utils/i18n");
=======

>>>>>>> b9e7367006069f33940f96daa9502cad52ea4cb4
// miniprogram/pages/venue/city/city.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
<<<<<<< HEAD
  select(e){
    const { name } = e.currentTarget.dataset;    
    wx.setStorageSync(config.storageKey.currentCity, name)
    wx.switchTab({
      url: '/pages/index/index',
=======
  select(){
    wx.navigateBack({
      delta: -1,
>>>>>>> b9e7367006069f33940f96daa9502cad52ea4cb4
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  async loadData(){
    wx.showLoading({
    })
    const list = await getCityList();
<<<<<<< HEAD
    list.map(item => {
      item.city = i18n.i18n.getLang() ? item.cityCN : item.cityEn;
      item.desc = i18n.i18n.getLang() ? item.desc : item.descEn;
      return item;
    })
=======
>>>>>>> b9e7367006069f33940f96daa9502cad52ea4cb4
    this.setData({
      list
    }, () => {
      wx.hideLoading({
        success: (res) => {},
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})