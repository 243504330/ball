//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    console.log(666)
    var that = this;
    var pub_url = this.globalData.url;
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
            var data = JSON.parse(res.data.object);

            if (res.data.retCode == '000') {
              that.globalData.openid = data.openid
              that.globalData.session_key = data.session_key
              that.globalData.unionid = data.unionid
            } else {

            }
          },
          fail(error) {
            console.log(error)
          }
        })
      }
    })
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  console.log(888)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: null,
    session_key: null,
    unionid: null,
    url:'https://toys.mediahx.com'
    // url: 'http://toys.dev108.com',
  }
})