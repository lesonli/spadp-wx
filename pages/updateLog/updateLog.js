// updateLog.js
var api_system = require('../../utils/api_system.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    api_system.getUpdateLog(function(res){
      var logList = [];
      if(res.res_code == 1){
        res.msg.forEach(function (element,index){
          var log = element;
          log.content = JSON.parse(log.content);
          logList.push(log);
        });
        that.setData({
          logList:logList
        });
      }
    });
  },
  goLiuYan:function(e){
    wx.navigateTo({
      url: '../contactUS/contactUS?title=' + e.currentTarget.dataset.title
    })
  }
})