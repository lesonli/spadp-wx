// aboutUS.js
var api_system = require('../../utils/api_system.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    api_system.getAppInfo(function(res){
      if(res.res_code == 1){
        that.setData({
          appInfo:res.msg
        })
      }
    });
  }
})