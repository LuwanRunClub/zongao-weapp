const config = {
  env: 'zhongao-2gmar3weeb4e1ffc',
  appId: 'wx40ed28a90a609dd9',
  version: 2,
  appTitle: '众奥赛事',
  appDescription: '众奥赛事小程序',
  mapKey: 'SRKBZ-ZZVO2-P34UD-CWJHY-YQFQV-NLFXB',
  mapSig: 'aKlxXOLwqBO164rcHbHEr95YyWg2R7',
  storageKey: {
    kits: 'xterra.kits',
    searchHistory: 'searchHistory',
    currentCheckInRace: 'currentCheckInRace',
    currentCity: 'currentCity',
    isChinese: 'isChinese'
  },
  tabs: [
    "pages/index/index",
    "pages/events/events",
    "pages/community/index/index",
    "pages/news/news",
    "pages/my/my"
  ],
  messageTemplates: {
    registration: {
      title: '赛事活动报名通知',
      templateId: '_vztpYRCQvQIZn99wA_uXmHkR6iev-XeR6FVCu6WMVc',
      templateNo: 2150,
      fields: [
        {
          key: 'name1',
          name: '姓名'
        },
        {
          key: 'phone_number2',
          name: '手机'
        },
        {
          key: 'thing3',
          name: '赛事名称'
        },
        {
          key: 'amount4',
          name: '参赛金额'
        },
        {
          key: 'time5',
          name: '参赛时间'
        },
      ]
    },
    cancel: {
      title: '赛事活动取消通知',
      templateId: 'MhL_yke-_38-eZ5daRHXHilRP19gwXdJBzzQjw3x5Uw',
      templateNo: 13999,
      fields: [
        {
          key: 'thing1',
          name: '活动名称'
        },
        {
          key: 'time2',
          name: '活动时间'
        },
        {
          key: 'thing3',
          name: '取消原因'
        },
        {
          key: 'thing4',
          name: '取消人'
        },
        {
          key: 'thing5',
          name: '备注'
        }
      ]
    },
  }
};

module.exports = config;