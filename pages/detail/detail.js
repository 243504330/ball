
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
    userId:'',
    type:'',
    lockType:'',
    animationData:'',
    clickInfo:'',
    showType:'success'
  },
  getBack:function(){
    this.aniSuccess();
    wx.navigateBack();
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadDetail()
  },
  userClick:function(opt){
    
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
       
        if (res.data.retCode == '000') {
          that.userInfoAni();
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
  close:function(){
    this.userInfoAni();
  },
  onShareAppMessage(res) {
    var id = this.data.id;
    console.log(res);
    var type = res.target.id;
    var title = '';
    if(type == 'lock'){
      title = '我偷偷给你留了位置…';
    }else{
      title = '篮球激情对决，就差你一人…';
    }
    if (res.from === 'button') {
    }
    return {
      title: title,
      path: 'pages/index/index?id='+id + '&type=' + type + '&page=detail'
    }
  },
  onShow:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
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
        that.loadDetail();
      },
      fail(err) {
        console.log('err')
        that.loadDetail();
      }
    })
  },
  onLoad: function (opt) {

    var pub_url = getApp().globalData.url;
    wx.login({
      success(ress) {
        var code = ress.code

        wx.request({
          url: pub_url + '/streetball/Pay/MiniProgramPay/getOpenId',
          method: 'GET',
          data: {
            terminal: 'ios',
            code: code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)

            if (res.data.retCode == '000') {
              var data = JSON.parse(res.data.object);
              getApp().globalData.openid = data.openid
              getApp().globalData.session_key = data.session_key
              getApp().globalData.unionid = data.unionid
            } else {

            }
          },
          fail(error) {
            console.log(error)
          }
        })
      }
    })


    var id = opt.id;  
    var that = this;
    var lockType = opt.type;

    this.setData({
      id: id,
      pub_url: pub_url,
      lockType: lockType
    })

    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth

    this.setData({
      scroll_height: windowHeight,
    })
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res)
              var gender = res.userInfo.gender;
              if (gender == 1) {
                var sex = 'B'
              } else {
                var sex = 'G'
              }
              that.setData({
                type: 'phone',
                screen_name: res.userInfo.nickName,
                gender: sex,
                iconurl: res.userInfo.avatarUrl
              })
            }
          })
        } else {
          that.setData({
            type: 'wx',
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
    console.log(this.data.userId)
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var url = getApp().globalData.url;
      var that = this;
      var sessionKey = getApp().globalData.session_key;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv

      wx.showLoading();
      wx.request({
        url: url + '/streetball/user/minProgramDecrypt',
        method: 'GET',
        data: {
          terminal: 'ios',
          sessionKey: sessionKey,
          encryptedData: encryptedData,
          iv: iv
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.retCode == '000') {
            var obj = JSON.parse(res.data.object);

            that.setData({
              recNum: obj.phoneNumber
            })
            that.zLogin();
          } else {
            wx.showToast({
              title: res.data.rtnMsg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(error) {
          console.log(error)
        }
      })
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  zLogin: function () {
    var url = getApp().globalData.url;
    var recNum = this.data.recNum;
    var unionid = getApp().globalData.openid;
    var screen_name = this.data.screen_name;
    var gender = this.data.gender;
    var iconurl = this.data.iconurl;
    var that = this;

    wx.request({
      url: url + '/streetball/user/checkAndLogin',
      method: 'GET',
      data: {
        terminal: 'ios',
        mobilePhone: recNum,
        weixinId: unionid,
        nickName: screen_name,
        gender: gender,
        iconurl: iconurl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {

          if (res.data.object.city == '') {
            var id = res.data.object.id;
            wx.navigateTo({
              url: '../user-data/user-data?id=' + id,
            })
          } else {
            var user_data = JSON.stringify(res.data.object);

            that.setData({
              userId:res.data.object.id
            })

            wx.setStorage({
              key: 'user_data',
              data: user_data
            })
            wx.showToast({
              title: res.data.rtnMsg,
              icon: 'none',
              duration: 1000
            })

            that.loadDetail();
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
          title: '网络异常，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  bindGetUserInfo(e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      var res = e.detail;
      var gender = res.userInfo.gender;
      if (gender == 1) {
        var sex = 'B'
      } else {
        var sex = 'G'
      }
      wx.showToast({
        title: '授权成功',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        that.setData({
          type: 'phone',
          phoneLogin: false,
          screen_name: res.userInfo.nickName,
          gender: sex,
          iconurl: res.userInfo.avatarUrl
        })
      }, 500)
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  loadDetail:function(){
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var that = this;
    var userId = this.data.userId;
    var lock = this.data.lockType;
    console.log(lock)
    if(lock == 'lock'){
      lock = 'Y'
    }else{
      lock = 'N'
    }

    wx.request({
      url: pub_url + '/streetball/stadium/ballTeamInfo',
      method: 'GET',
      data: {
        terminal: 'ios',
        orderId: id,
        userId: userId,
        lock: lock
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

          var ob = res.data.object;

          if (ob.status == 'failed' || ob.actualNum == ob.actualSize){
            that.setData({
              showType:'failed'
            })
            that.aniSuccess();
          }

          var time = res.data.object.time;
          time = time.split('  ');
          var images = res.data.object.images;
          var lockNum = parseFloat(res.data.object.lockNum);
          console.log(lockNum)
          var lockList = [];
          var imageList = [];
          lockList.push(images[0])
          console.log(lockNum)
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
          console.log(lockList)
          that.setData({
            info:res.data.object,
            day:time[0],
            time:time[1],
            lockList: lockList
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
  userInfoAni:function(){
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
  aniSuccess:function(){
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
  formSubmit:function(opt){
    var formId = opt.formId;
    var lockType = this.data.lockType;
    console.log(!lockType);
    if(!lockType){
      lockType = '';
    }

    if (this.data.info.price > 0){
      var orderId = this.data.info.orderId;
      var priceDes = this.data.info.priceDes;
      var address = this.data.info.address;
      var stadiumPlace = this.data.info.stadiumPlace;
      var time = this.data.info.time;
      wx.navigateTo({
        url: '../join-team/join-team?priceDes=' + priceDes + '&address=' + address + '&stadiumPlace=' + stadiumPlace + '&time=' + time + '&orderId=' + orderId + '&lockType=' + lockType,
      })
    }else{
      if (lockType == 'lock') {
        lockType = 'Y'
      }else{
        lockType = ''
      }
      wx.showLoading({
        title: '加载中',
      })

      var pub_url = this.data.pub_url;
      var that = this;
      var price = this.data.info.priceDes;
      var id = this.data.id;
      price = parseFloat(price.substring(1));
      var userId = this.data.userId;
      var openId = getApp().globalData.openid;
      wx.showLoading({
        title: '加载中',
      })

      var data = {
        terminal: 'ios',
        orderId: id,
        price: price,
        userId: userId,
        formId: formId,
        openId: openId,
        lockShare: lockType
      }
      console.log(data)
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
            that.aniSuccess();
            wx.hideLoading()
            that.loadDetail()
            
            setTimeout(function () {
              that.aniSuccess();
            }, 2000)

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

    }

  },
  goGroup:function(){

  },
  chose:function(e){
    console.log(e)
  }
})
