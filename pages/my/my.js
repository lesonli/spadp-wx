// my.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  goToPage:function(e){

    var page = e.currentTarget.dataset.page;
    var pageURL = '/pages/' + page + '/' + page;
    wx.navigateTo({
      url: pageURL
    })
  }
})