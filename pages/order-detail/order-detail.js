
Page({
  data: {
    logs: [],
    list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    scroll:true,
    id:0,
    day:'',
    time:'',
    info:'',
    success:'none',
    orderTime:'',
    userInfo:'none',
    lockList:'',
    userId:''
  },
  mapOpen: function (e) {
    var info = this.data.info;
    var latitude = parseFloat(info.latitude);
    var longitude = parseFloat(info.longitude);
    var that = this
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18
    })
  },
  userInfo:function(){
    this.setData({
      userInfo:'block'
    })
  },
  close:function(){
    this.setData({
      userInfo:'none'
    })
  },
  onLoad: function (opt) {
    console.log(opt)
    var id = opt.id;
    var that = this;
    var pub_url = getApp().globalData.url;
    var openId = getApp().globalData.openid;
    this.setData({
      id: id,
      pub_url: pub_url,
      openId: openId
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        that.setData({
          userId: json.id,
          userImg: json.photo
        })
        console.log(that.data.userId)
        that.loadDetail();
      },
      fail(err) {

      }
    })
  },
  userInfoAni: function () {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var menusFlag = this.data.userInfo;
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
    animation.scale(0.1, 0.1).step({ duration: 500 })

    this.setData({
      userInfoAni: animation.export()
    })
    var that = this
    setTimeout(function () {
      that.setData({
        userInfo: flag
      })
      animation.scale(1, 1).step({ duration: 500 })

      that.setData({
        userInfoAni: animation.export()
      })
    }, 200)
  },
  userClick: function (opt) {

    var that = this;
    var pub_url = this.data.pub_url;
    var id = opt.currentTarget.id;
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      userId: id,
      terminal: 'ios'
    }
    wx.request({
      url: pub_url + '/streetball/userInfo/getUserInfo',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.userInfoAni();
        if (res.data.retCode == '000') {
          that.setData({
            clickInfo: res.data.object
          })
          wx.hideLoading()
        } else {
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
  close: function () {
    this.userInfoAni();
  },
  onShareAppMessage(res) {
    var id = this.data.id;
    console.log(res);
    var type = res.target.id;
    var title = '';
    if (type == 'lock') {
      title = '我偷偷给你留了位置…';
    } else {
      title = '篮球激情对决，就差你一人…';
    }
    if (res.from === 'button') {
    }
    return {
      title: title,
      path: 'pages/index/index?id=' + id + '&type=' + type + '&page=detail'
    }
  },
  loadDetail:function(){
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var that = this;
    var userId = this.data.userId;

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: pub_url + '/streetball/Pay/MyOrder/queryMyOrderDetail',
      method: 'GET',
      data: {
        terminal: 'ios',
        orderId: id,
        userId:userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          var time = res.data.object.time;
          time = time.split('  ');
          var images = res.data.object.photo;
          var lockNum = parseFloat(res.data.object.lockSize);
          var lockList = [];
          var imageList = [];
          lockList.push(images[0])
          for (var i = 0; i < lockNum;i++){
            var ix = i
            console.log(i)
            if(ix == 0){
              ix = '0a'
            }
            lockList.push(ix)
          }
          for (var i = 1; i < images.length;i++){
            lockList.push(images[i])
          }
          var orderTime = res.data.object.orderTime;
          var time = new Date(orderTime);
          var y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          var h = time.getHours();
          var mm = time.getMinutes();
          var s = time.getSeconds();
          orderTime = (y + '.' + (m) + '.' + (d) + ' ' + (h) + ':' + (mm))
          that.setData({
            info:res.data.object,
            day:time[0],
            time:time[1],
            lockList: lockList,
            orderTime: orderTime
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
  joinTeam:function(){
    
  },
  goGroup:function(){

  },
  chose:function(e){
    console.log(e)
  }
})
