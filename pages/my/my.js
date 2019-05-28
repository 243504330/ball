
Page({
  data: {
    logs: [],
    userInfo:'',
    pub_url:'',
    data_info:'',
    order:'',
    sheng: [],
    shi: [],
    qu: [],
    userId: '',
    citiesId: '',
    picker: 'none',
    arr: [0, 0, 0],
    addrName: '活动范围',
    btnFlag: false,
    data_provinceId: '',
    data_cityId: '',
    data_areaId: '',
  },
  cancel: function () {
    this.setData({
      picker: 'none'
    })
  },
  addCheck:function(){
    this.setData({
      picker:'block'
    })
  },
  down: function () {
    var arr = this.data.arr;
    console.log(arr)
    var sheng = this.data.sheng;
    var shi = this.data.shi;
    var qu = this.data.qu;
    var pub_url = this.data.pub_url;

    var that = this;

    var data_provinceId = sheng[arr[0]].provinceId;
    var data_cityId = shi[arr[1]].cityId;
    var data_areaId = qu[arr[2]].areaId;

    console.log(shi)
    console.log(qu)

    var addrName = shi[arr[1]].city + ' ' + qu[arr[2]].area;

    this.setData({
      picker: 'none',
      data_provinceId: data_provinceId,
      data_cityId: data_cityId,
      data_areaId: data_areaId
    })

    console.log(addrName)

    var datas = this.data.data_info;

    var data = {
      userId: datas.id,
      height: datas.height,
      age: datas.age,
      weight: datas.weight,
      provinceId: this.data.data_provinceId,
      cityId: this.data.data_cityId,
      areaId: this.data.data_areaId,
      level: datas.level,
      position: datas.position,
      frequency: datas.frequency,
      terminal: 'ios',
      gender: datas.gender
    }

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: pub_url + '/streetball/user/modifyTheUser',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.data.retCode == '000') {
          that.loadUserData();
          wx.showToast({
            title: res.data.rtnMsg,
          })

        } else {
          wx.hideLoading()
        }
      },
      fail(error) {
        wx.hideLoading()
      }
    })
  },
  userData:function(){
    wx.navigateTo({
      url: '../user-data/user-data',
    })
  },
  onShareAppMessage() {
    return {
      title: '一起来篮球',
      path: 'pages/index/index'
    }
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadList()
  },
  loadList:function(){
    var userId = this.data.userInfo.id;
    var pub_url = this.data.pub_url;
    var that = this;
    var data = {
      status:'',
      userId:userId,
      pageCurrent:0,
      pageSize:1,
      terminal:'ios'
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
          if(res.data.data != ''){
            that.setData({
              order: res.data.data[0]
            })
          }
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
          title: '网络无法连接，稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  loadInd:function(){
    var pub_url = this.data.pub_url;
    var that = this;
    wx.request({
      url: pub_url + '/streetball/user/findProvinces',
      data: {
        provinceId: '',
        terminal: 'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.data.retCode == '000') {
          that.setData({
            sheng: res.data.data,
            provinceId: res.data.data[0].provinceId
          })
          var provinceId = that.data.provinceId;
          wx.request({
            url: pub_url + '/streetball/user/findCities',
            data: {
              cityId: '',
              provinceId: provinceId,
              terminal: 'ios'
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)

              if (res.data.retCode == '000') {
                that.setData({
                  shi: res.data.data,
                  citiesId: res.data.data[0].cityId
                })
                var citiesId = that.data.citiesId;
                wx.request({
                  url: pub_url + '/streetball/user/findAreas',
                  data: {
                    areaId: '',
                    cityId: citiesId,
                    terminal: 'ios'
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    console.log(res)

                    if (res.data.retCode == '000') {
                      that.setData({
                        qu: res.data.data
                      })
                    } else {

                    }
                  },
                  fail(error) {
                    console.log(error)
                  }
                })
              } else {

              }
            },
            fail(error) {
              console.log(error)
            }
          })
        } else {

        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  loadQu: function () {
    var pub_url = this.data.pub_url;
    var that = this;
    var citiesId = this.data.citiesId;
    console.log(citiesId)
    wx.request({
      url: pub_url + '/streetball/user/findAreas',
      data: {
        areaId: '',
        cityId: citiesId,
        terminal: 'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.data.retCode == '000') {
          that.setData({
            qu: res.data.data
          })
        } else {

        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  bindChange: function (e) {
    console.log(e)
    var pIndex = e.detail.value[0];
    var cIndex = e.detail.value[1];

    this.setData({
      arr: e.detail.value
    })


    var sheng = this.data.sheng;
    var provinceId = sheng[pIndex].provinceId;
    this.setData({
      provinceId: provinceId
    })
    this.loadShi();
    var that = this;
    setTimeout(function () {
      var shi = that.data.shi;
      var cityId = shi[cIndex].cityId;
      that.setData({
        citiesId: cityId
      })
      console.log(cityId)
      that.loadQu();
    }, 500)

  },
  loadShi: function () {
    var pub_url = this.data.pub_url;
    var that = this;
    var provinceId = this.data.provinceId;
    wx.request({
      url: pub_url + '/streetball/user/findCities',
      data: {
        cityId: '',
        provinceId: provinceId,
        terminal: 'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.data.retCode == '000') {
          that.setData({
            shi: res.data.data,
            citiesId: res.data.data[0].cityId
          })
        } else {

        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  loadUserData:function(){
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

        var data = {
          userId: json.id,
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
              that.setData({
                data_info: res.data.object
              })
            } else {

            }
          },
          fail(error) {
            console.log(error)
          }
        })

        that.loadList();
        console.log(that.data.order);

      },
      fail(err) {
        wx.hideLoading()
      }
    })
  },
  onShow:function(){
    this.loadUserData();
  },
  goDetail: function (opt) {
    var id = opt.currentTarget.id;
    wx.navigateTo({
      url: '../order-detail/order-detail?id=' + id,
    })
  },
  onLoad: function () {
    var that = this;
    var pub_url = getApp().globalData.url;
    let windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(windowWidth);

    this.setData({
      pub_url: pub_url,
      windowWidth: windowWidth
    })
    wx.showLoading({
      title: '加载中',
    })
  },
  login:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  goGroup:function(){
    var userinfo = this.data.userInfo;
    if(userinfo == ''){
      wx.navigateTo({
        url: '../login/login',
      })
      return false
    }
    wx.navigateTo({
      url: '../group-pin/group-pin',
    })
  }
})
