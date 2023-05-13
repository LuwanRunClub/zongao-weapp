const tencentcloud = require("tencentcloud-sdk-nodejs");

const SesClient = tencentcloud.ses.v20201002.Client;
/*
SecretId: AKIDGNL9qaN1f4GF0dBhARVLyRlz9NctCKUZ
SecretKey: ynaL9qSvFSXwBG9qfVKEEB990fTEqTvL*/
const clientConfig = {
  credential: {
    secretId: "AKIDGNL9qaN1f4GF0dBhARVLyRlz9NctCKUZ",
    secretKey: "ynaL9qSvFSXwBG9qfVKEEB990fTEqTvL",
  },
  region: "ap-hongkong",
  profile: {
    httpProfile: {
      endpoint: "ses.tencentcloudapi.com",
    },
  },
};

// 云函数入口函数
exports.main = async (event, context) => {
  const { templateId, to, subject, data } = event;
  console.log("Start to sendemail", event)
  //开始发送邮件
  const client = new SesClient(clientConfig);
  const params = {
      "Destination": [
        to
      ],
      "Template": {
          "TemplateID": templateId || 12688,
          "TemplateData": JSON.stringify(data)
      },
      "FromEmailAddress": "noreply@xterra.club",
      "Subject": subject,
      "ReplyToAddresses": "noreply@xterra.club"
  };
  client.SendEmail(params).then(
    (data) => {
      console.log(data);
      return data;
    },
    (err) => {
      console.error("error", err);
      return err;
    }
  );  
}


