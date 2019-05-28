
Page({
  data: {
    logs: [],
    list:[],
    windowHeight:0,
    type:'all',
    currentTab:0,
    userInfo:'',
    pub_url:'',
    pinChang:'',
    pinSuccess:'',
    pinFail:'',
    pinOk:''
  },
  onLoad: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      windowHeight: windowHeight
    })
    var that = this;
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url: pub_url
    })
  },
  onShow:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        that.setData({
          userInfo: json
        })

        var data = {
          userId: json.id,
          terminal: 'ios'
        }

        that.loadList();

      },
      fail(err) {

      }
    })
  },
  goDetail:function(opt){
    var id = opt.currentTarget.id;
    wx.navigateTo({
      url: '../order-detail/order-detail?id='+id,
    })
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadList();
  },
  upper: function () {

    wx.startPullDownRefresh()
  },
  loadList: function () {
    var userId = this.data.userInfo.id;
    var pub_url = this.data.pub_url;
    var that = this;
    var data = {
      status: '',
      userId: userId,
      pageCurrent: 0,
      pageSize: 100,
      terminal: 'ios'
    }
    wx.request({
      url: pub_url + '/streetball/Pay/MyOrder/queryMyOrders',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh()
      },
      success(res) {
        console.log(res)

        if (res.data.retCode == '000') {
          console.log(res)
          var list = res.data.data;
          var pinChang = [];
          var pinSuccess = [];
          var pinFail = [];
          var pinOk = [];
          

          if (res.data.retCode == '000') {
              console.log(list.length)
            for (var i = 0; i < list.length; i++) {
              if (list[i]['status'] == 'matching') {
                pinChang.push(list[i])
              }
              if (list[i]['status'] == 'succeed') {
                pinSuccess.push(list[i])
              }
              if (list[i]['status'] == 'failed') {
                pinFail.push(list[i])
              }
              if (list[i]['status'] == 'finished') {
                pinOk.push(list[i])
              }
            }

            that.setData({
              list:list,
              pinChang:pinChang,
              pinSuccess:pinSuccess,
              pinFail:pinFail,
              pinOk:pinOk
            })

            // wx.hideLoading();
            setTimeout(function(){
              wx.hideLoading();
            },1000)

          } else {

          }
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
  bindOrder:function(event){
    console.log(event)
    var page = event.detail.current;
    var type = '';
    if(page == 0){
      type = 'all';
    }
    if(page == 1){
      type = 'pin';
    }
    if(page == 2){
      type = 'success'
    }
    if(page == 3){
      type = 'fail'
    }
    if(page == 4){
      type = 'ok'
    }
    this.setData({
      type:type
    })
  },
  chose:function(opt){
    console.log(opt)
    var type = opt.currentTarget.id;
    var currentTab = 0;
    if(type == 'all'){
      currentTab = 0
    }
    if(type == 'pin'){
      currentTab = 1
    }
    if(type == 'success'){
      currentTab = 2
    }
    if(type == 'fail'){
      currentTab = 3
    }
    if(type == 'ok'){
      currentTab = 4
    }
    this.setData({
      type:type,
      currentTab: currentTab
    })
  },
  onPullDownRefresh() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(function () {
      wx.stopPullDownRefresh({
        complete(res) {
          wx.hideToast()
          console.log(res, new Date())
        }
      })
    }, 1000)

  },
})
