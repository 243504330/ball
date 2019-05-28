
Page({
  data: {
    pub_url:'',
    nodes:'',
    url:'',
    id:''
  },
  onShow:function(){
    var pub_url = this.data.pub_url;

  },
  loadBanner: function () {
    var that = this;
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var url = pub_url + '/streetball/advert/showAdvertDetails?terminal=ios&advertId=' + id
    console.log(url)
    this.setData({
      url: url
    })
  },
  onLoad: function (e) {
    console.log(e)
    var that = this;
    var pub_url = getApp().globalData.url;
    var id = e.id;
    this.setData({
      pub_url: pub_url,
      id:id
    })
    this.loadBanner();
  }
})
