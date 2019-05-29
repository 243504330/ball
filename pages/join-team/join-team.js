
Page({
  data: {
    logs: [],
    list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    scroll:true,
    id:0,
    info:'',
    userId:'',
    openId:'',
    lockType:'',
    success:'none',
    animationData:'',
    succType:'none',
    animationSuc:''
  },
  readyPay:function(){
    this.aas();
  },
  guanbi:function(){
    this.aas();
  },
  aas:function(){
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var menusFlag = this.data.succType;
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
      animationSuc: animation.export()
    })
    var that = this
    setTimeout(function () {
      that.setData({
        succType: flag
      })
      animation.scale(1, 1).step({ duration: 500 })

      that.setData({
        animationSuc: animation.export()
      })
    }, 200)
  },
  aniSuccess: function () {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var menusFlag = this.data.success;
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
      animationData: animation.export()
    })
    var that = this
    setTimeout(function () {
      that.setData({
        success: flag
      })
      animation.scale(1, 1).step({ duration: 500 })

      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  onLoad: function (opt) {
    console.log(opt)
    var that = this
    var lockType = opt.lockType;
    if(lockType == 'lock'){
      this.setData({
        lockType:'Y'
      })
    }else{
      this.setData({
        lockType:''
      })
    }
    var info = {address:opt.address,priceDes:opt.priceDes,stadiumPlace:opt.stadiumPlace,time:opt.time,orderId:opt.orderId};
    var pub_url = getApp().globalData.url;
    var openId = getApp().globalData.openid;
    this.setData({
      info:info,
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
      },
      fail(err) {

      }
    })
  },
  formSubmit: function (opt){
    this.aas();
    var that = this;
    var pub_url = this.data.pub_url;
    var info = this.data.info;
    var price = this.data.info.priceDes;
    price = parseFloat(price.substr(1));
    var formId = opt.detail.formId;
    var openId = this.data.openId;
    var orderId = info.orderId;
    var lockShare = this.data.lockType;
    //orderId：订单id         price:支付金额    userId：用户id  formId：               openId：
    var data = {
      orderId:orderId,
      price:price,
      userId:this.data.userId,
      formId: formId,
      openId: openId,
      terminal:'ios',
      lockShare: lockShare
    }

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: pub_url + '/streetball/Pay/Order/createOrderDetail',
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        
        if (res.data.retCode == '000') {
          var detailId = res.data.ext.orderDetail.id;
          wx.request({
            url: pub_url + '/streetball/Pay/MiniProgramPay/getSignMiniP',
            method: 'GET',
            data: {
              terminal: 'ios',
              orderId: detailId,
              price: price,
              spbill_create_ip: '192.168.1.1',
              openid: openId,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              
              if (res.data.retCode == '000') {
                wx.requestPayment({
                  timeStamp: res.data.timestamp,
                  nonceStr: res.data.nonce_str,
                  package: 'prepay_id=' + res.data.prepay_id,
                  signType: 'MD5',
                  paySign: res.data.sign,
                  success(res) {
                    wx.hideLoading()
                    that.aniSuccess();
                    setTimeout(function(){
                      wx.navigateBack()
                    },1500)
                  },
                  fail(res) {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })

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
  chose:function(e){
    console.log(e)
    var id = e.currentTarget.id;
    this.setData({
      id:id
    })
  }
})
