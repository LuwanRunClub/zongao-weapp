import { getCollectionByWhere, getSingleCollectionByWhere } from "../utils/cloud"

export const getSettingDetail = async () => {
  const data = await getSingleCollectionByWhere({ dbName: "setting", filter: { } });
  return data;
}

export const getHomePageRaces = async (size = 2) => {
  const data = await getCollectionByWhere({ dbName: 'race', filter: { isActive: true }});
  return data;
}