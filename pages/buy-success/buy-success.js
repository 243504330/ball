
Page({
  data: {
    logs: [],
    list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    scroll:true,
    id:'',
    ptBtn:true,
    back:true,
    btn:'确认',
    title:'预定成功',
    name:'请到我的页面查看详情'
  },
  onLoad: function (opt) {
    console.log(opt)
    var id = opt.id;
    this.setData({
      id:id
    })
  },
  onShareAppMessage(res) {
    var id = this.data.id;
    console.log(id);
    if (res.from === 'button') {
    }
    return {
      title: '一起来打球',
      path: 'pages/detail/detail?id=' + id
    }
  },
  goOrder:function(){
    var id = this.data.id;
    wx.redirectTo({
      url: '../detail/detail?id='+id,
    })
  },
  goGroup:function(){

  },
  backIndex:function(){
    wx.switchTab({
      url: '../index/index'
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
