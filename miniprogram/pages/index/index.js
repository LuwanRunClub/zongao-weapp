const { getBannerList } = require("../../api/race");
const app = getApp();
const { getNewsIndexList } = require("../../api/news");
const dayjs = require("dayjs");
const i18n = require("./../../utils/i18n");

const _t = i18n.i18n.translate();
const { getSettingDetail, getHomePageRaces } = require("../../api/setting");

// miniprogram/pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fontLoaded: false,
    loading: false,
    banners: [],
    news: [],
    races: [],
    headerBarHeight: 60,
    current: 0,
    currentCity: null,
    places: [],
    isChinese: i18n.i18n.getLang(),
    setting: null,
    races: []
  },
  onVideoLoaded(){
    console.log('onVideoLoaded')
  },
  async loadRaces() {
    const races = await getHomePageRaces();
    races.map((item) => {
      item.cates = item.catesName ? item.catesName.join("/") : "/";
      item.raceDate = dayjs(new Date(item.raceDate)).format("MM月DD日");
      return item;
    });
    this.setData({ races });
  },
  async loadSetting(){
    const setting = await getSettingDetail();
    if(setting.videoUrl){
      const reg = /https:\/\/v.qq.com\/x\/page\/(\w+).html/;
      const matched = setting.videoUrl.match(reg);
      const _vid = matched?.[1];
      setting._vid = _vid;
    }
    this.setData({ setting });
  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current,
    });
  },
  onVideoPlay(e){
    console.log(e)
  },
  mainSwiperChanged(e) {},
  gotoNews(){
    const { url } = e.currentTarget.dataset;
    debugger;
    wx.switchTab({
      url,
    })
  },
  redirect(e) {
    const { url, wechaturl } = e.currentTarget.dataset;
    if (wechaturl) {
      wx.navigateTo({
        url: `/pages/more/webview/webview?url=${wechaturl}`,
      });
      return;
    }
    debugger
    try{
      wx.navigateTo({
        url,
      });
    }catch{
      wx.switchTab({
        url,
      })
    }
  },
  tap(e) {
    let { src, type, url, bannerid } = e.currentTarget.dataset;
    const { banners } = this.data;
    const urls = banners.map((item) => item.picUrl);
    switch (type) {
      case "preview":
        wx.previewImage({
          urls,
          current: src,
        });
        break;
      case "navigate":
        getApp().globalData.bid = bannerid;
        if (!url.startsWith("/")) {
          url = "/" + url;
        }
        url = url.replace(".html", "");
        const isTabbar =
          url.indexOf("/pages/news/news") >= 0 ||
          url.indexOf("pages/events/events") >= 0;
        if (isTabbar) {
          app.globalData.tabBarLink = url;
          wx.switchTab({
            url,
          });
          return;
        }
        wx.navigateTo({
          url,
        });
        break;
    }
  },
  async fetch() {
    wx.showLoading({
      title: _t["加载中…"],
    });
    const banners = await getBannerList();
    const news = await getNewsIndexList();
    news.map(item => {
      item.formatDate = dayjs(new Date(item.postTime)).format("YYYY-MM-DD");
      return item;
    });

   // const citys = await getCityList();
    this.setData(
      {
        loading: false,
        //races,
        news,
        //citys,
        banners,
      },
      () => {
        wx.hideLoading({
          success: (res) => {},
        });
      }
    );
  },
  watchChanges(dbName) {
    const db = wx.cloud.database();
    const that = this;
    db.collection(dbName).watch({
      onChange: function (snapshot) {
        const { type } = snapshot;
        if (type !== "init") {
          that.fetch();
        }
        console.log("snapshot", snapshot);
      },
      onError: function (err) {
        console.error("the watch closed because of error", err);
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await Promise.all([this.fetch(), this.loadSetting(), this.loadRaces()]);
    this.watchChanges("banner");
    // this.watchChanges('news');
    this.setData(
      {
        headerBarHeight: app.globalData.headerBarHeight,
      },
    );
  },
  onShow() {
    this.setData(
      {
        isChinese: i18n.i18n.getLang(),
        _t: i18n.i18n.translate(),
      }
    );
  },
});
