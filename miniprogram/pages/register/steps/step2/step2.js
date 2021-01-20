const {
  getMyProfilesWithCate, getRaceCatesList
} = require("../../../../api/race")
const app = getApp();
// pages/register/userlist/userlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    raceId: {
      type: String
    },
  },


  /**
   * 组件的初始数据
   */
  data: {
    profiles: [],
    cates: [],
    cate: null
  },
  lifetimes: {
    attached: function () {
      this.fetch();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async fetch() {
      wx.showLoading({
        title: '加载中……',
      })
      app.checkLogin().then(async res => {
        const { userId } = res;
        const { cateId } = app.globalData.order;
        let profiles = await getMyProfilesWithCate(userId, cateId);
        console.log(profiles)
        
        const {
          raceId
        } = this.properties;
        const cates = await getRaceCatesList(raceId);
        const cate = cates.find(item => item._id === cateId);
        this.setData({
          cateId,
          cates,
          cate,
          profiles
        }, () => {
          wx.hideLoading({
            success: (res) => {},
          })
        });
      })
    },
    checkboxChanged(e){
      const profileIds = e.detail.value;
      let { profiles, cate } = this.data;
      profiles = profiles.filter(item => {
        return profileIds.includes(item._id);
      });
      if(profiles.length > cate.teamSizeLimit){
        wx.showToast({
          icon: 'none',
          title: `已经超出报名人数限制`,
        });
        this.triggerEvent('onComplete', { prevEnabled: true, nextEnabled: false }); 
        return;
      }
      app.globalData.order.profiles = profiles;
      app.globalData.order.profileCount = profiles.length;
      let totalFee = 0;
      const { groupType, isTeamLeader } = app.globalData.order;
      let minProfiles = 1;
      if(groupType === 'individual'){
        totalFee = app.globalData.order.price * profiles.length;
      }else if(groupType === 'relay'){
        totalFee = isTeamLeader ? app.globalData.order.price : 0;
      }else{
        minProfiles = 2;
        totalFee = app.globalData.order.price;
      }
      
      app.globalData.order.totalFee = +totalFee.toFixed(2);
      app.globalData.order.paidFee = +totalFee.toFixed(2);
      app.globalData.order.discountFee = 0;
      this.triggerEvent('onComplete', { prevEnabled: true, nextEnabled: profileIds.length >= minProfiles });
    },
    gotoAdd(e){
      const { url } = e.currentTarget.dataset;
      wx.navigateTo({
        url
      })
    }
  }
})
