import { getCollectionById, getPaginations, getSingleCollectionByWhere } from "../utils/cloud";
import { getAllRegistrationsByRaceId } from "./registration";
const dayjs = require("dayjs");

export const getUserDetail = async id => {
  const data = await getCollectionById({ dbName: 'userlist', id });
  return data;
}

export const getStartListList = async ( cateId, size = 1000) => {
  const data = await getPaginations({
    dbName: 'start-list',
    filter: {
      cateId
    },
    pageIndex: 1,
    pageSize: size
  })
  return data;
}

export const getStartListListByRaceId = async ( raceId, size = 1000) => {
  const data = await getPaginations({
    dbName: 'start-list',
    filter: {
      raceId
    },
    pageIndex: 1,
    pageSize: size
  })
  return data;
}

export const updateStartListCert = async (id, certRecheckUrl) => {
  const db = wx.cloud.database()
  const usersTable = db.collection("start-list")
  return await usersTable.doc(id).update({
    data: {certRecheckUrl}
  });
};

export const exportReport = async cateId => {
  const db = wx.cloud.database()
  const cateTable = db.collection("race-cates");
  return new Promise(async (resolve, reject) => {
    const cate = await cateTable.doc(cateId).get();
    const { title } = cate.data;
    console.log(`开始读取${title}报名人数`);
    const res = await getStartListList(cateId);
    let users = [['报名人', '姓名', '性别', '手机号', '微信号','国籍','证件类型','证件号码','出生日期','邮箱','所属俱乐部','血型','衣服尺码', '省份', '住址','紧急联系人','紧急联系人手机', '是否参加过X-Plogging']];
    res.forEach(item => {
      let user = [];
      user.push(item.userName);
      user.push(item.trueName);
      user.push(item.gender);
      user.push(item.phoneNum);
      user.push(item.wechatid);
      user.push(item.nation);
      user.push(item.cardType);
      user.push(item.cardNo);
      user.push(dayjs(item.birthDate).format("YYYY-MM-DD"));
      user.push(item.email);
      user.push(item.club);
      user.push(item.bloodType);
      user.push(item.tSize);
      user.push(item.region);
      user.push(item.addr);
      user.push(item.contactUser);
      user.push(item.contactUserPhone);
      user.push(item.plogging);
      users.push(user);
    })
  
    console.log(`共有报名人数${users.length}`);
  
    const dateStr = dayjs().format("YYYY-MM-DD-HH-mm-ss");
    const fileName =  `${title}-${dateStr}完整报名表.xlsx`;
    const sheetName = '完整报名表';
    try{
      wx.cloud.callFunction({
        name: 'exportCSV',
        data: {
          data: users,
          fileName,
          sheetName
        },
        success(res) {
          resolve(res.result)
        }
      });
    }catch(err){
      reject(err)
    }
  })
}


export const exportRegReportByRaceId = async raceId => {
  const db = wx.cloud.database()
  const raceTable = db.collection("race");
  return new Promise(async (resolve, reject) => {
    const race = await raceTable.doc(raceId).get();
    const { title } = race.data;
    console.log(`开始读取${title}报名人数`);
    const res = await getStartListListByRaceId(raceId);
    let cols = ['组别', '审核通过', '姓名', '性别', '手机号', '微信号','国籍','证件类型','证件号码','出生日期','邮箱','所属俱乐部','血型','衣服尺码', '省份', '住址','紧急联系人','紧急联系人手机'];
    const isPlogging = race.type === 'X-Plogging';
    if(isPlogging){
      cols.push('是否参加过X-Plogging');
    }
    let users = [cols];
    res.forEach(item => {
      let user = [];
      user.push(item.cateTitle);
      user.push(item.isCertApproved ? '是' : '否');
      user.push(item.trueName);
      user.push(item.gender);
      user.push(item.phoneNum);
      user.push(item.wechatid);
      user.push(item.nation);
      user.push(item.cardType);
      user.push(item.cardNo);
      user.push(dayjs(item.birthDate).format("YYYY-MM-DD"));
      user.push(item.email);
      user.push(item.club);
      user.push(item.bloodType);
      user.push(item.tSize);
      user.push(item.region);
      user.push(item.addr);
      user.push(item.contactUser);
      user.push(item.contactUserPhone);
      if(isPlogging){
        user.push(item.plogging);
      }
      users.push(user);
    })
  
    console.log(`共有报名人数${users.length}`);
  
    const dateStr = dayjs().format("YYYY-MM-DD-HH-mm-ss");
    const fileName =  `${title}-${dateStr}完整报名表.xlsx`;
    const sheetName = '完整报名表';
    try{
      wx.cloud.callFunction({
        name: 'exportCSV',
        data: {
          data: users,
          fileName,
          sheetName
        },
        success(res) {
          resolve(res.result)
        }
      });
    }catch(err){
      reject(err)
    }
  })
}

export const exportFinanceReport = async (total, raceId) => {
  const db = wx.cloud.database()
  const raceTable = db.collection("race");
  let pageIndex = 1, pageSize = 200;
  const pageCount = Math.ceil(total / pageSize);
  let promises = [];
  for(let i = 1; i <= pageCount; i++){
    const promise = new Promise(async (resolve, reject) => {
      const res = await getAllRegistrationsByRaceId(raceId, i, pageSize );
      resolve(res)
    });
    promises.push(promise);
  }
  
  return new Promise(async (resolve, reject) => {
    const race = await raceTable.doc(raceId).get();
    const { title } = race.data;
    console.log(`开始读取${title}报名人数`);

    Promise.all(promises).then(result=>{
      const res = result.flat();
      res.map(item => {
        item.addedDate = dayjs(item.addedDate).format("YYYY-MM-DD HH:mm:ss");
        item.profiles = item.profiles && item.profiles.length ? item.profiles.map(p=>p.trueName).join() : '';
      });
      let orders = [['订单编号', '订单提交人', '类别', '赛事', '组别', '报名人数', '报名人', '订单状态', '订单金额', '优惠金额', '实付金额', '退款金额', '支付方式' ,'下单时间']];
      res.forEach(item => {
        let user = [];
        user.push(item.orderNum);
        user.push(item.userName);
        user.push(item.groupText);
        user.push(item.raceTitle);
        user.push(item.cateTitle);
        user.push(item.profileCount);
        user.push(item.profiles);
        user.push(item.statusText);
        user.push(item.totalFee);
        user.push(item.discountFee);
        user.push(item.paidFee);
        user.push(item.refundFee);
        user.push(item.orderType);
        user.push(item.addedDate);
        orders.push(user);
      })
    
      console.log(`共有订单${orders.length}`);
    
      const dateStr = dayjs().format("YYYY-MM-DD-HH-mm-ss");
      const fileName =  `${title}-${dateStr}完整订单表.xlsx`;
      const sheetName = '完整订单表';
      try{
        wx.cloud.callFunction({
          name: 'exportCSV',
          data: {
            data: orders,
            fileName,
            sheetName
          },
          success(res) {
            resolve(res.result)
          }
        });
      }catch(err){
        reject(err)
      }
    })
  });
}

export const checkInUser = async (userId) => {
  const db = wx.cloud.database();
  const _ = db.command;
  return await db.collection("userlist").doc(userId).update({
    data: {
      checkInTime: _.inc(1)
    }
  })
};