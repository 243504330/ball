
Page({
  data: {
    logs: [],
    list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    scroll:true,
    id:'',
    info:'',
    arrs:[],
    choseId:0,
    week:'',
    userInfo:'',
    windowHeight: 0,
    menusFlag: 'none',
    timesTop: 0,
    onPull:'down'
  },
  loadDates:function(){
    var arr = [];

    for (var i = 1; i < 30; i++) {
      var timestamp = new Date().getTime() + ((60 * 60 * 24) * i * 1000);
      var newDate = new Date(timestamp)
      var y = newDate.getFullYear();
      var m = newDate.getMonth() + 1;
      var d = newDate.getDate();
      var week = newDate.getDay();
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }

      if (week == 0) {
        week = '日'
      }
      if (week == 1) {
        week = '一'
      }
      if (week == 2) {
        week = '二'
      }
      if (week == 3) {
        week = '三'
      }
      if (week == 4) {
        week = '四'
      }
      if (week == 5) {
        week = '五'
      }
      if (week == 6) {
        week = '六'
      }
      var date = y + '-' + m + '-' + d;

      var arrs = { date: date, week: week ,day:d}
      arr.push(arrs)
    }
    let windowHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      arrs:arr,
      windowHeight: windowHeight
    })
  },
  onShow:function(){
    var that = this;
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        that.setData({
          userInfo: json
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    this.loadDates();
    this.loadInfo();
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadInfo();
  },
  upper: function () {
    var onPull = this.data.onPull;
    if(onPull == 'down'){
      this.setData({
        onPull:'up'
      })
      wx.startPullDownRefresh()
    }
  },
  onShareAppMessage() {
    var id = this.data.id;

    return {
      title: '一起来篮球',
      path: 'pages/index/index?type=place&id=' + id
    }
  },
  scrollEvent: function (e) {
    var top = e.detail.scrollTop;
    var menusFlag = this.data.menusFlag;
    var timesTop = this.data.timesTop;
    if (top > timesTop && menusFlag == 'none') {

      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
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
        animationData: animation.export()
      })
      this.setData({
        menusFlag: flag
      })
      animation.translateY(end).step({ duration: 500 })

      this.setData({
        animationData: animation.export()
      })
    }
    if (top < timesTop && menusFlag == 'block') {
      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
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
        animationData: animation.export()
      })
      this.setData({
        menusFlag: flag
      })
      animation.translateY(end).step({ duration: 500 })

      this.setData({
        animationData: animation.export()
      })
    }
  },
  onLoad: function (opt) {
    var that = this;
    wx.createSelectorQuery().select('#timesDe').boundingClientRect(function (rect) {
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      // rect.height  // 节点的高度

      that.setData({
        timesTop: rect.top
      })

    }).exec()
    var pub_url = getApp().globalData.url;
    var id = opt.id;
    var timestamp = new Date().getTime() + ((60 * 60 * 24) * 1 * 1000);
    var myDate = new Date(timestamp)
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    month = month + 1;
    var day = myDate.getDate();
    var week = myDate.getDay();
    if (week == 0) {
      week = '日'
    }
    if (week == 1) {
      week = '一'
    }
    if (week == 2) {
      week = '二'
    }
    if (week == 3) {
      week = '三'
    }
    if (week == 4) {
      week = '四'
    }
    if (week == 5) {
      week = '五'
    }
    if (week == 6) {
      week = '六'
    }
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    var time = year + '-' + month + '-' + day;
    this.setData({
      pub_url:pub_url,
      id:id,
      time:time,
      week: week
    })

  },
  loadDetail:function(){
    var that = this;
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    var day = myDate.getDate();

    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }

    var time = year + '-' + month + '-' + day;
    wx.request({
      url: pub_url + '/streetball/stadium/stadiumJoins',
      method: 'GET',
      data: {
        terminal: 'ios',
        stadiumId: id,
        time: time
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.retCode == '000') {
          that.setData({
            info: res.data.object
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
  loadInfo: function () {
    var that = this;
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var time = this.data.time;
    
    wx.request({
      url: pub_url + '/streetball/stadium/stadiumInfo',
      method: 'GET',
      data: {
        terminal: 'ios',
        stadiumId: id,
        time: time
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh(function(){
          console.log(123)
        })
        that.setData({
          onPull:'down'
        })
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            info: res.data.object
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
          title: '网络无法连接，稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  goGroup:function(){

  },
  goGroups:function(opt){
    var userinfo = this.data.userInfo;
    if (userinfo == '') {
      wx.navigateTo({
        url: '../login/login',
      })
      return false
    }
    var stadiumDelId = opt.currentTarget.id;
    wx.navigateTo({
      url: '../groups/groups?stadiumDelId=' + stadiumDelId,
    })
  },
  goYuding:function(opt){

    var userinfo = this.data.userInfo;

    if(userinfo == ''){
      wx.navigateTo({
        url: '../login/login',
      })
      return false
    }


    var idx = opt.currentTarget.id;
    var data = this.data.info;
    var info = data.stadiumDels[idx];
    var placeInfo = data.stadium;
    //场地 地址 预定时间 钱 id
    var stadiumId = info.id;
    var address = placeInfo.address;
    var name = placeInfo.name;
    var price = info.price;
    var day = info.day;
    var time = info.time;
    var week = this.data.week;
    var placeId = this.data.info.stadium.id;

    var str = '?stadiumId='+stadiumId+'&address='+address+'&name='+name+'&price='+price+'&day='+day+'&time='+time+'&week='+week + '&placeId='+placeId;

    wx.navigateTo({
      url: '../ball-pay/ball-pay' + str,
    })
  },
  makeCall:function(){
    var info = this.data.info.stadium;
    var phone = info.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  mapOpen:function(e){
    var info = this.data.info.stadium;
    var latitude = parseFloat(info.latitude);
    var longitude = parseFloat(info.longitude);

    var that = this
    wx.openLocation({
      latitude:latitude,
      longitude:longitude,
      scale: 18
    })
  },
  chose:function(e){
    var id = e.currentTarget.id;
    var date = e.currentTarget.dataset.time;
    var week = e.currentTarget.dataset.week;
    this.setData({
      choseId:id,
      time:date,
      week: week
    })
    wx.showLoading({
      title: '加载中',
    })
    this.loadInfo();
  }
})
