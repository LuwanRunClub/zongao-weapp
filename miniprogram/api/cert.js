import { getCollectionByWhere, getSingleCollectionByWhere } from "../utils/cloud"

export const getPloggingTemplate = async () =>{
  const data = await getCollectionByWhere({ dbName: "cert", filter: { type: 'X-Plogging' } });
  return data;
}

export const getCertTemplate = async raceId => {
  const data = await getSingleCollectionByWhere({ dbName: "cert", filter: { raceId } });
  return data;
}

export const getCertFields = (raceId, isPlogging) => {
  return new Promise(async (resolve, reject) => {
    let cert = null;
    if(isPlogging){
      cert = await getPloggingTemplate();
      cert = cert[0]
     }else{
      cert = await getCertTemplate(raceId);
     }
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection("cert-field").where({
      _id: _.in(cert.fields)
    }).get().then(res=>{
      resolve(res.data)
    }).catch(err=>reject(err))
  });
}
