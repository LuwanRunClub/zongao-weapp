# XTERRA小程序
XTERRA官方小程序，主要功能:

玩赛小助手：太冬

- [ ] **赛事活动**
- [x] 活动列表
- [x] 赛事详情
	- [x] 赛事报名
	- [x] 团队报名
	- [x] 亲子报名
	- [x] 免责协议
	- 修改报名信息
	- [x] 微信支付
	- [x] 发送邮件
	- [x] 查询报名
	- 报到二维码
	- 成绩查询
	- 加入志愿者
	- 图片上传
	- [x] 赛事流程
	- [x] 强制装备
	- [x] 赛事动态
	- 动态阅读
* 个人页
	- [x] 授权登陆
	- 注册完善资料
	- [x] 我的报名列表
	- [x] 报名资料管理
	- 完赛资质上传
	- [x] 报名详情
	- [x] 报名结果
	- 我的发贴列表
	- [x] 修改个人信息
	- [x] 帮助中心
	- [x] 关于我们
* 社区	
  - 社区首页
	- 打卡
	- 我的打卡
	- 发布帖子
	- 用户详情
	- 帖子详情
	- 评论列表
* 积分系统	
  - 积分首页
	- 可兑换商品列表
	- 可兑换商品详情
	- 兑换商品
	- 积分排行榜
	- 积分介绍
	- 我的积分记录
	- 抽奖活动列表
	- 抽奖详情
	- 抽奖
	- 抽奖通知





## TODO
报名成功表
邮件
价格
退款政策
检验是否已经报名过

## 介绍

## 链接
https://zhongao-2gmar3weeb4e1ffc-1258634640.tcloudbaseapp.com/wx-cms/
[CMS](https://xterra-c2969f-1258173660.tcloudbaseapp.com)
admin/1qaz2wsx

12-14
姓、名
微信号
选择框 免责协议
完善资质审核
优惠券：使用次数
号码：
AM001
AF001
导出名单
退款金额可自定义
12.25
1.5
设计图片不做处理
登录验证手机号

报名人关系

12-21
强制装备 组别
模板内容自定义动态数据

优惠券只能对应指定赛事和组别
优惠券折扣百分比

优先xplogging报名功能

生成成绩证书

12-22
在线客服
衣服尺码默认不要
复制默认信息

首次资料页：
只需要姓名、性别、手机号

报名表单（动态字段）
增加微信号
家庭住址=>邮寄地址

第2、3屏先隐藏

没有完成比赛，不可以下载证书

x-plogging每站一场比赛，

12-25

- 退款后保留名额
- 报满后不可继续报名
- 添加报名人重复不可添加

12-25
表单
 国籍
 跑团


优惠券：
使用


赛事详情：价格显示不正确 

点击报名后直接跳到了确认付款界面，没有让选择报名人信息
设置的需要成绩证书，实际并没有让我填报上传

banner跳转到x-plogging列表页


组别：
年龄组限制（赛事当天是否年满年龄）
接力组人数限制

x-plogging证书下载(未完成比赛不能下载)
媒体中心过滤条件

1.4
50k 30k强制比赛证书资质
取消报名，不应该显示在后台
证书下载增加编号信息
报名信息，同一报名人添加的，显示出来关系

### 1.7
重复报名
导出优惠券
报名信息提取出省市信息

30分钟内没有支付转为取消
我的订单中：待支付和支付失败订单，是否可以用户管理，用户可以选择删除

### 1.11
选手资质审核
财务报表
团报导入
邮件、短信
动态（仅限官方消息）

### 1.13
1. 报名确认短信和邮件无
2. 资质审核功能无
3. 选手名单中无报名费信息，无财务报表
4. 线下报名名单导入功能2 options: 内容覆盖与不覆盖
5. 赛事图片直播功能暂不考虑开发
6. 赛事动态发布功能继续
-----
1. 报名短信和邮件仍然收不到，CMS后台也没有显示发出记录
2. 报名成功显示总费用非实际支付费用，为设定的组别报名费
3. 退费申请也是按设定的组别报名费50%，而不是实际付款金额为基础；并且点击申请退费后就显示退款失败
已报名人数20限制

还有退款金额的显示
删除订单无法报名
短信和邮件

退款短信和邮件

## 1.18
支付报名不成功
审核报名资质
数据自动更新
清理重复数据
优惠券导出20条限制

优惠券按比例
之前已经参加过X-Plogging，则报名选项默认选中

## 1.25
财务报表：商户订单号、退款金额、拼音姓名
铁三接力报名顺序

## 2.1
团报

选手端：
1、亮二维码
2.1	没有查询到报名记录，请检查“ => end
2.2、电子协议
3、检录完成

志愿者端：
1、扫描二维码 | 输入身份证号
2、查看资料
4、“确定检录”点击
5、检录完成

成绩：
1、越野
CP点时间
2、铁三

号码布生成：
越野跑比赛选手号码编码规则：
1. 分组别：ABCD
2. 分男女：M（男）F（女）
3. 号码按报名顺序001开始往后编，再每个组别多加一些后备号码（具体加多少我们后面沟通，一般一个组别20个差不多了）

举例：
- 50K女选手第一个报名的：AF001
- 30K 男选手第二个报名的：BM002


2021/7/26
选择城市照片
首页语言 tab
左右切换
个人主页 
徽章图标

X-Discovery

2021/9/3
地理位置
上传视频


### 小程序跳转
以下用于公众号：

第一步：公众号插入时选择开启账户
pages/events/events.html?type=X-Plogging&raceId=6
第二步：将此地址进行编码，并放到url.html后
pages/url/url.html?url=pages/events/events.html?type%3DX-Plogging%26raceId%3D6

注意其中：
%3D：?
%26：&

常用链接：
1. 跳转X-Plogging：
pages/url/url.html?url=pages/events/events.html?type%3DX-Plogging

2. 跳转X-Disovery
pages/url/url.html?url=pages/events/events.html?type%3DX-Disovery