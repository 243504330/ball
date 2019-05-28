//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    list:[],
    allMenus: ['全部','包场','拼场'],
    menus:['全部', '今天', '明天','本周', '下周', '其他时间'],
    times: ['全部', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    windowWidth:0,
    page:0,
    animationData:'',
    timesanimationData:'',
    allanimationData: '',
    animationBg:'',
    menusFlag:'none',
    animatioJd:'',
    x11:'',
    userInfo:'',
    menusName:'日期',
    dateName:'开始时间',
    timesFlag:"none",
    allFlag:"none",
    allName:'全部场',
    timesPage:0,
    allPage:0,
    bgFlag:'none',
    bgType:'',
    longitude:'',
    latitude:''
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadList()
  },
  bgClick:function(){
    var bgType = this.data.bgType;
    if (bgType == 'all'){
      this.allClick();
    }
    if (bgType == 'times'){
      this.timesClick();
    }
    if (bgType == 'chose'){
      this.choseClick();
    }
  },
  aaClick:function(e){
    var page = e.currentTarget.id;
    var menus = this.data.allMenus;
    var menusName = menus[page]
    console.log(menusName)
    this.setData({
      allPage: page,
      allName: menusName
    })
    wx.showLoading({
      title: '加载中',
    })
    this.allClick();
    this.loadList();
  },
  ttClick:function(e){
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    var page = e.currentTarget.id;
    var menus = this.data.times;
    var menusName = menus[page]
    this.setData({
      timesPage: page,
      dateName: menusName
    })
    this.timesClick();
    this.loadList();
  },
  ccClick:function(e){
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    var page = e.currentTarget.id;
    var menus = this.data.menus;
    var menusName = menus[page]
    this.setData({
      page:page,
      menusName: menusName
    })
    this.choseClick();
    this.loadList();
  },
  onReady: function () {
    this.animation = wx.createAnimation()
  },
  allClick: function () {

    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var timesFlag = this.data.timesFlag;
    var menusFlag = this.data.menusFlag;
    if (timesFlag == 'block' || menusFlag == 'block') {
      return false
    }
    this.setData({
      bgType: 'all'
    })
    var menusFlag = this.data.allFlag;
    var begin = 0;
    var end = 0;
    var flag = '';
    if (menusFlag == 'block') {
      begin = 0;
      end = -220;
      flag = 'none';
    } else {
      begin = -220;
      end = 0;
      flag = 'block';
    }
    animation.translateY(begin).step({ duration: 0 })

    this.setData({
      allanimationData: animation.export()
    })
    this.setData({
      allFlag: flag,
      bgFlag:flag
    })
    animation.translateY(end).step({ duration: 500 })

    this.setData({
      allanimationData: animation.export()
    })

  },
  timesClick: function () {

    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })

    var allFlag = this.data.allFlag;
    var menusFlag = this.data.menusFlag;
    if(allFlag == 'block' || menusFlag == 'block'){
      return false
    }
    this.setData({
      bgType: 'times'
    })
    var menusFlag = this.data.timesFlag;
    var begin = 0;
    var end = 0;
    var flag = '';
    if (menusFlag == 'block') {
      begin = 0;
      end = -400;
      flag = 'none';
    } else {
      begin = -400;
      end = 0;
      flag = 'block';
    }
    animation.translateY(begin).step({ duration: 0 })

    this.setData({
      timesanimationData: animation.export()
    })
    this.setData({
      timesFlag: flag,
      bgFlag: flag
    })
    animation.translateY(end).step({ duration: 500 })

    this.setData({
      timesanimationData: animation.export()
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
    var timesFlag = this.data.timesFlag;
    var allFlag = this.data.allFlag;
    if (timesFlag == 'block' || allFlag == 'block') {
      return false
    }
    this.setData({
      bgType: 'chose'
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
      menusFlag: flag,
      bgFlag: flag
    })
    animation.translateY(end).step({ duration: 500 })

    this.setData({
      animationData: animation.export()
    })

   },
  onShareAppMessage() {
    return {
      title: '一起来篮球',
      path: 'pages/index/index'
    }
  },
  qianwang: function (opt) {
    console.log(opt);
    var id = opt.currentTarget.id;
    var orderTime = opt.currentTarget.dataset.ordertime;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&orderTime=' + orderTime,
    })
  },
   onShow:function(){
     this.setData({
       menusFlag: 'none'
     })
     var that = this;
     var pub_url = this.data.pub_url;
     wx.getStorage({
       key: 'user_data',
       success(res) {
         var json = JSON.parse(res.data);
         console.log(json)
         that.setData({
           userInfo: json
         })
       },
       fail(err) {

       }
     })
     wx.getLocation({
       type: 'wgs84',
       success(res) {
         var latitude = res.latitude
         var longitude = res.longitude

         that.setData({
           latitude: latitude,
           longitude: longitude
         })
         that.loadList();
       },
       fail() {
         that.loadList();
       }
     })
     var list = this.data.list;
     console.log(list)
     
     for(var i = 0;i<list.length;i++){
       var ani = 'ani' + i
       this.animation = wx.createAnimation({
         duration: 500,
         timingFunction: 'ease'
       })
       this.animation.width('80%').step({ duration: 1000 });

       var x = 'x' + i;
       var json = { x: this.animation.export()}

       this.setData(json)
     }
   },
   loadList:function(){
     var that = this;
     var pub_url = this.data.pub_url;
     var orderClass = ['', 'group','match'];
     var day = ['', 'today', 'tomorrow', 'thisWeek', 'nextWeek','afterNextWeek'];
     var startTime = ['', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
     orderClass = orderClass[this.data.allPage];
     day = day[this.data.page];
     startTime = startTime[this.data.timesPage]
     //today,
    //  明天：tomorrow,
    //    本周：thisWeek
    //  下周：nextWeek
    //  其他：afterNextWeek

     var latitude = this.data.latitude;
     var longitude = this.data.longitude;
     
     wx.request({
       url: pub_url + '/streetball/stadium/getballTeamList',
       method: 'GET',
       data: {
         terminal: 'ios',
         longitude: longitude,
         latitude: latitude,
         orderClass: orderClass,
         day:day,
         startTime: startTime,
         pageCurrent:0,
         pageSize:200
       },
       header: {
         'content-type': 'application/json' // 默认值
       },
       complete:function(){
         wx.stopPullDownRefresh()
       },
       success(res) {
         console.log(res)
         if (res.data.retCode == '000') {
           var list = res.data.data;
           for(var i = 0 ; i < list.length ; i ++ ){
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
             list:list
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
           title: '网络无法连接，稍后重试!',
           icon: 'none',
           duration: 2000
         })
       }
     })
   },
    onLoad: function () {
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;

    var menus = this.data.menus;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      windowWidth: windowWidth,
      pub_url: pub_url,
      menus:menus,
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    
  }
})
