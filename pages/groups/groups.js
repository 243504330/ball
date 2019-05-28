//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    list:[],
    windowWidth:0,
    menus:[],
    page:0,
    animationData:'',
    animationBg:'',
    menusFlag:'none',
    pub_url:'',
    stadiumDelId:''
  },
  onReady: function () {
    this.animation = wx.createAnimation()
  },
  qianwang: function (opt) {
    console.log(opt);
    var id = opt.currentTarget.id;
    var orderTime = opt.currentTarget.dataset.ordertime;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&orderTime=' + orderTime,
    })
  },
  choseClick:function(){
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var menusFlag = this.data.menusFlag;
    var begin = 0;
    var end = 0;
    var flag = '';
    if(menusFlag == 'block'){
      begin = 0;
      end = -220;
      flag = 'none';
    }else{
      begin = -220;
      end = 0;
      flag = 'block';
    }
    animation.translateY(begin).step({ duration : 0})

    this.setData({
      animationData: animation.export()
    })
    this.setData({
      menusFlag: flag
    })
    animation.translateY(end).step({ duration: 500 })

    this.setData({
      animationData: animation.export()
    })

   },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadList()
  },
   onShow:function(){
     this.setData({
       menusFlag: 'none'
     })
     wx.showLoading({
       title: '加载中',
     })
     var that = this
     wx.getLocation({
       type: 'wgs84',
       success(res) {
         const latitude = res.latitude
         const longitude = res.longitude
         const speed = res.speed
         const accuracy = res.accuracy
         that.setData({
           latitude: latitude,
           longitude: longitude
         })
         that.loadList()
       },
       fail: function () {
         that.loadList()
       }
     })
   },
   loadList:function(){
     var that = this;
     var pub_url = this.data.pub_url;
     var stadiumDelId = this.data.stadiumDelId;
     var latitude = this.data.latitude;
     var longitude = this.data.longitude;
     wx.request({
       url: pub_url + '/streetball/stadium/stadiumJoins',
       method: 'GET',
       data: {
         terminal: 'ios',
         longitude: longitude,
         latitude: latitude,
         stadiumDelId: stadiumDelId
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       complete: function () {
         wx.stopPullDownRefresh()
       },
       success(res) {
         console.log(res)
         if (res.data.retCode == '000') {
          var list = res.data.data;
           for (var i = 0; i < list.length; i++) {
             var psen = list[i].actualNum;
             psen = psen.split('/');
             var priceDes = list[i].priceDes;
             priceDes = priceDes.split('￥');
             priceDes = priceDes[1];
             psen = parseFloat(psen[0]) / parseFloat(psen[1]);
             list[i]['psen'] = psen;
             list[i]['priceDes'] = priceDes;
           }
           that.setData({
             list: list
           })
           wx.hideLoading()
         }else{
           wx.showToast({
             title: res.data.rtnMsg,
             icon: 'none',
             duration: 2000
           })
         }
       },
       fail(error) {
         wx.showToast({
           title: '网络无法连接，请稍后重试！',
           icon: 'none',
           duration: 2000
         })
       }
     })
   },
  onLoad: function (opt) {
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    var stadiumDelId = opt.stadiumDelId;

    console.log(stadiumDelId)

    this.setData({
      windowWidth: windowWidth,
      stadiumDelId: stadiumDelId,
      pub_url:pub_url,
      menus:['全部','今天','本天','下周','其他时间'],
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
   
  }
})
