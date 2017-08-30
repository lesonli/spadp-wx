// questions.js
var api_system = require('../../utils/api_system.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    api_system.getQuestions(function (res) {
      if (res.res_code == 1) {
        that.setData({
          questions: res.msg
        });
      }
    });
  }
})