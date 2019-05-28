
Page({
  data: {
    logs: [],
    list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    scroll:true,
    id:0,
    pinchang:'none',
    baochang:'block',
    ctClass:'b-c',
    info:'',
    isFriend:'朋友',
    type:'bao',
    peoNum:12,
    lockNum:0,
    userId:'',
    userImg:'',
    freeType:'',
    openId:'',
    lock2:false,
    lock1:false
  },
  unlock:function(e){
    var id = e.currentTarget.id;
    var lockNum = this.data.lockNum - 1;
    if (id == 'lock1') {
      this.setData({
        lock1: false,
        lockNum: lockNum
      })
    }
    if (id == 'lock2') {
      this.setData({
        lock2: false,
        lockNum: lockNum
      })
    }
    if (id == 'lock3') {
      this.setData({
        lock3: false,
        lockNum: lockNum
      })
    }
    if (id == 'lock4') {
      this.setData({
        lock4: false,
        lockNum: lockNum
      })
    }
    if (id == 'lock5') {
      this.setData({
        lock5: false,
        lockNum: lockNum
      })
    }
    wx.showToast({
      title: '解锁成功',
      icon: 'none',
      duration: 1000
    })
  },
  lock:function(e){
    console.log(e)
    var id = e.currentTarget.id;
    var lockNum = this.data.lockNum + 1;
    if(id == 'lock2'){
      this.setData({
        lock2:true,
        lockNum: lockNum
      })
    }
    if (id == 'lock1') {
      this.setData({
        lock1: true,
        lockNum: lockNum
      })
    }
    if (id == 'lock3') {
      this.setData({
        lock3: true,
        lockNum: lockNum
      })
    }
    if (id == 'lock4') {
      this.setData({
        lock4: true,
        lockNum: lockNum
      })
    }
    if (id == 'lock5') {
      this.setData({
        lock5: true,
        lockNum: lockNum
      })
    }
    wx.showToast({
      title: '锁位成功',
      icon: 'none',
      duration: 2000
    })
  },
  friendClick:function(opt){
    var isFriend = '';
    var id = opt.currentTarget.id;

    this.setData({
      isFriend: id
    })
  },
  chosePeo:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['6人', '9人', '12人'],
      success(res) {
        console.log(res.tapIndex)
        var index = res.tapIndex;
        var peoNum = 0;
        if(index == 0){
          peoNum = 6;
        }
        if(index == 1){
          peoNum = 9;
        }
        if(index == 2){
          peoNum = 12;
        }
        that.setData({
          peoNum:peoNum
        })
        console.log(that.data.peoNum)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  onLoad: function (opt) {
    var that = this;
    var openId = getApp().globalData.openid;
    this.setData({
      openId:openId
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        that.setData({
          userId: json.id,
          userImg:json.photo
        })
      },
      fail(err) {

      }
    })
    var days = opt.day.split('-');
    var day = parseInt(days[1]) + '月' + parseInt(days[2]) + '日'
    var info = {address:opt.address,day:day,name:opt.name,price:opt.price,stadiumId:opt.stadiumId,time:opt.time,week:opt.week,placeId:opt.placeId};
    console.log(info)
    var pub_url = getApp().globalData.url;
    this.setData({
      info:info,
      pub_url:pub_url
    })
  },
  goGroup:function(){

  },

  formSubmit:function(opt){

    var type = this.data.type;
    var freeType = '';
    if(type != 'pin'){
      if(this.data.isFriend == '朋友'){
        freeType = 'friend';
      }else{
        freeType = 'stranger';
      }
    }
    var pub_url = this.data.pub_url;
    var formId = opt.detail.formId;
    var openId = this.data.openId;
    var time = this.data.info.time;
    var memberSize = this.data.peoNum;//球员任务
    var lockSize = this.data.lockNum;
    var stadiumId = this.data.info.placeId;
    var userId = this.data.userId;
    var stadiumDetailId = this.data.info.stadiumId;
    var price = this.data.info.price;
    var freeType = freeType;
    var data = {
      formId: formId,
      openId: openId,
      time: time,
      memberSize: memberSize,
      lockSize: lockSize,
      stadiumId: stadiumId,
      userId: userId,
      stadiumDetailId: stadiumDetailId,
      price: price,
      terminal:'ios',
      freeType:freeType
    }
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: pub_url + '/streetball/Pay/Order/createOrder',
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.retCode == '000') {

          var pay_price = parseFloat(res.data.ext.order.orderAmt);
          var orderId = res.data.ext.order.id;
          
          wx.request({
            url: pub_url + '/streetball/Pay/MiniProgramPay/getSignMiniP',
            method: 'GET',
            data: {
              terminal: 'ios',
              orderId: orderId,
              price: pay_price,
              spbill_create_ip: '192.168.1.1',
              openid: openId,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
              if (res.data.retCode == '000') {
                wx.hideLoading()
                wx.requestPayment({
                  timeStamp: res.data.timestamp,
                  nonceStr: res.data.nonce_str,
                  package: 'prepay_id=' + res.data.prepay_id,
                  signType: 'MD5',
                  paySign: res.data.sign,
                  success(res) {
                    wx.redirectTo({
                      url: '../buy-success/buy-success?id='+orderId,
                    })
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
                title:'网络连接超时，请稍后重试！',
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
          title: '网络连接超时，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })

    return false
    wx.navigateTo({
      url: '../buy-success/buy-success',
    })
  },
  pinClick:function(){
    console.log(666)
    this.setData({
      pinchang:'block',
      baochang:'none',
      ctClass:'p-c',
      type:'pin'
    })
  },
  baoClick:function(){
    this.setData({
      pinchang: 'none',
      baochang: 'block',
      ctClass: 'b-c',
      type:'bao'
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
