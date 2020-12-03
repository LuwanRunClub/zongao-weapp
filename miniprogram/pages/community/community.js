const { getFeedIndexList } = require("../../api/feed");
const { feedStatus } = require("../../config/const");
const dayjs = require("dayjs");
// miniprogram/pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statuses: [
      feedStatus.normal,
      feedStatus.top
    ]
  },
  async fetch(){
    const { statuses } = this.data;
    const list = await getFeedIndexList(statuses[0]);
    list.map(item=>{      
      item.addedDate = dayjs(new Date(item.addedDate)).format("MM月DD日 hh:mm");
      return item;
    })
    this.setData({
      list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetch();
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