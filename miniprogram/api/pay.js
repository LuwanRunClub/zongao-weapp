import dayjs from "dayjs";
import { emailTemplateType, orderStatus } from "../config/const";
import { sendRegEmail } from "./email";
import { getRegistrationByOrderNum, updateBibNum, updateCoupon, updateOrderStatus } from "./race";
import { sendRegSMS } from "./sms";
const logManager = wx.getRealtimeLogManager();

export const adminChangeStatus = async function(orderNum, isSendSms, isSendEmail, callback) {
  const order = await getRegistrationByOrderNum(orderNum);
  updateStatuses({ ...order, skipSendEmail: !isSendEmail, skipSendSms: !isSendSms }, callback)
};

export const payNow = function(detail, callback) {
  const { paidFee } = detail;
  const nonceStr = Math.random().toString(36).substr(2, 15)
  const timeStamp = parseInt(Date.now() / 1000) + ''
  const out_trade_no = "otn" + nonceStr + timeStamp
  const total_fee = Math.round(paidFee * 100);
  console.log('total_fee', total_fee);
  getApp().globalData.out_trade_no = out_trade_no;

  if(paidFee <= 0){
    updateStatuses(detail, callback);
    return;
  }
  wx.showLoading({
    title: '支付中',
  });

  wx.cloud.callFunction({
    name: "payment",
    data: {
      command: "pay",
      out_trade_no,
      body: detail.raceTitle,
      total_fee
    },
    success(res) {
      console.log("云函数payment提交成功：", res.result);      
      try{
        pay(res.result, detail, callback)         
      }catch(err){            
        logManager.error('pay', err);
      }
    },
    fail(res) {
      console.log("云函数payment提交失败：", res)
      logManager.error('pay', res);
      wx.showToast({
        title: '支付失败',
        icon: 'error'
      });
    }
  })
}
function pay(payData, detail, callback) {
  //官方标准的支付方法
  wx.requestPayment({ //已经得到了5个参数
    timeStamp: payData.timeStamp,
    nonceStr: payData.nonceStr,
    package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
    signType: 'MD5',
    paySign: payData.paySign, //签名

    success(res) {
      console.log("支付成功：", res)
      wx.cloud.callFunction({  //巧妙利用小程序支付成功后的回调，再次调用云函数，通知其支付成功，以便进行订单状态变更
        name: "payment",
        data: {
          command: "payOK",
          out_trade_no: "test0004"
        },
        success: function(){
          try{
            updateStatuses(detail, callback);            
          }catch(err){            
            logManager.error('pay', err);
          }
        }
      })
    },
    fail(res) {
      logManager.error('pay', res);
      console.log("支付失败：", res);
      const { paidFee, discountFee } = detail;
      updateOrderStatus({ id: detail._id, ...orderStatus.failed, paidFee, discountFee }).then(res2=>{
        console.log(res2);
        logManager.error('pay', res2);
        wx.showToast({
          icon: 'none',
          title: '支付失败',
          success: function(){
            wx.redirectTo({
              url: `/pages/register/status/status?id=${detail._id}`,
            })
          }
        })
      });
    },
   complete(res) {
      console.log("支付完成：", res)
    }
  })
};
function updateStatuses(detail, callback){
  wx.showLoading({
    title: '处理中……',
  })
  // 重要：此处更新保存out_trade_no，用于退款
  const { _id, paidFee, discountFee, raceId, userId } = detail;
  const { out_trade_no } = getApp().globalData;

  getApp().globalData.out_trade_no = null;
  const that = this;
  updateOrderStatus({ id: _id, ...orderStatus.paid, out_trade_no, paidFee, discountFee }).then(async res=>{
    await saveStartlist(detail);
    console.log(res);
    wx.showToast({
      icon: 'success',
      title: '支付成功',
      success: async function(){
        wx.showLoading({
          title: '处理订单中',
        })
        if(detail.couponId){
          updateCouponStatus(detail.couponId);
        }
        // wx.showLoading({
        //   title: '发送邮件短信中',
        //   icon: 'none'
        // })
        try{
          console.log('开始发送短信');
          sendEmailSMS(detail);
        }catch(err){          
          logManager.error('sms', err);
          wx.showToast({
            title: '发送短信邮件时发生错误',
            icon: 'none'
          })
        }
        // wx.showLoading({
        //   title: '发送短信中',
        // })
        //await updateRaceCate(detail);
        wx.showToast({
          icon: 'success',
          title: '报名成功',
          success: async (res) => {
            await updateBibNum(raceId, userId)
            if(callback){
              callback();
            }else{
              that.triggerEvent('onPaiedComplete');
            }
          },
        })
      }
    })
  })  
}
async function updateCouponStatus(id){
  const { userId, trueName } = getApp().globalData;
  const param = {
    id,
    assignedUserId: userId,
    assignedTrueName: trueName,
    usedTime: new Date(),
    isUsed: true
  }
  const res = await updateCoupon(param)
  const { updated } = res.stats;
  if(updated){
    console.log('优惠券使用成功')
  }
}
function saveStartlist(detail){
  const logManager = wx.getRealtimeLogManager();
  logManager.info('报名信息开始=====');
  logManager.info(detail);
  const { isTeamLeader, teamTitle, profiles, id, orderNum, userId, userName, userInfo, orderType, raceId, raceDate, raceType, raceTitle, racePic, cateId, cateTitle, groupType, groupText, out_trade_no } = detail;
  const db = wx.cloud.database();
  const userTable = db.collection("start-list");
  profiles.forEach(async item=>{
    delete item._openid;
    delete item._id;
    const profileId = item._id;
    console.log(item);
    const { cardNo } = item;
    const existed = await userTable.where({ cateId, cardNo }).get();
    try{
      if(existed.data.length === 0){
        const result = await userTable.add({
          data: {
            ...item,
            status: orderStatus.paid.status,
            statusText: orderStatus.paid.statusText, 
            createdAt: new Date(),
            isCertApproved: true,
            isTeamLeader, teamTitle, id, orderNum, profileId, userId, userName, userInfo, orderType, raceId, raceDate, raceType, raceTitle, racePic, cateId, cateTitle, groupType, groupText, out_trade_no
          }
        });
        console.log(result)
        logManager.info(result);
      }
    }catch(e){
      logManager.error(e);
    }
    logManager.info('报名信息截止=====');
  })
}

async function sendEmailSMS(order){
  const {
    raceId,
    discountFee,
    raceTitle,
    profiles,
    orderNum,
    cateTitle,
    price,
    totalFee,
    paidFee,
    skipSendEmail,
    skipSendSms
  } = order;
  try{
    await profiles.forEach(async profile => {
      const { trueName, phoneNum, email } = profile;
      const orderDate = dayjs(new Date()).format("YYYY年MM月DD日 HH:mm:ss");
      const params = { discountFee, orderDate, catePrice: price, cateNum: profiles.length, raceId, raceTitle, orderNum, cateTitle, price, totalFee, paidFee, trueName, phoneNum, email };
      if(!skipSendEmail){
        await sendEmail(params);
      } 
      if(!skipSendSms){
        await sendSms(params);
      }
    }) 
  }catch(err) {
    throw err;
  }
}
async function sendEmail(order) {
  const {
    raceId,
    raceTitle,
    orderNum,
    cateTitle,
    totalFee,
    paidFee, trueName, email, orderDate, cateNum, catePrice, discountFee
  } = order;
  const values = {
    raceId,
    raceTitle,
    trueName,
    email,
    orderDate,
    orderNum,
    cateNum,
    cateTitle,
    catePrice,
    totalFee,
    discountFee,
    paidFee
  };
  const res = await sendRegEmail(emailTemplateType.registration.value, values);
  console.log('邮件发送成功', res);
}

async function sendSms({ phoneNum, trueName, raceId, raceTitle, cateTitle}){
  const res = await sendRegSMS({
    mobile: phoneNum,
    trueName,
    raceId,
    raceTitle,
    cateTitle
  })
  console.log('短信发送成功', res);
};

// 更新race-cates下users
async function updateRaceCate(order){
  const { cateId } = order
  const data = { cateId };
  const res = await wx.cloud.callFunction({
    name: 'updateRaceCate',
    data
  })
  console.log(res);
}