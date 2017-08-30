// contactUS.js
var api_system = require('../../utils/api_system.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    content:"",
    disableSubmit:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.title);
    if(options.title){
      this.setData({
        'title': options.title
      })
    }
  },
  changeContent: function(e){
    this.setData({
      'content': e.detail.value
    })
  },
  changeTitle: function(e){
    this.setData({
      'title': e.detail.value
    })
  },
  lineChange:function(e){
    var that = this;
    if (e.detail.lineCount > 10) {
      wx.showModal({
        title: '提示',
        content: '问题描述最多输入10行！',
        showCancel: false,
        success: function (res) {
          that.setData({
            'disableSubmit': true
          })
        }
      })
    } else {
      if (this.data.disableSubmit) {
        this.setData({
          'disableSubmit': false
        })
      }
    }
  },

  submit: function (e) {
    var content = this.data.content.replace(/\n/g, '');
    var title = this.data.title.trim();
    if (title.length == "") {
      wx.showModal({
        title: '提示',
        content: '请输入标题文字！',
        showCancel: false
      })
      return;
    }
    if (content.length < 10) {
      wx.showModal({
        title: '提示',
        content: '问题描述至少10个字！',
        showCancel: false
      })
      return;
    }
    if (content.length > 200) {
      wx.showModal({
        title: '提示',
        content: '问题描述最多200个字！',
        showCancel: false
      })
      return;
    }

    var params = {};
    params.title = this.data.title;
    params.content = this.data.content;
    function doSuccess(res){
      if (res.res_code == 1) {
        wx.showModal({
          title: '提示',
          content: '留言成功！',
          showCancel: false,
          success: function (e) {
            wx.navigateBack();
          }
        })
      } else {
        wx.showModal({
          title: '留言失败！',
          content: res.msg,
          showCancel: false
        })
      }
    }
    api_system.addContactInfo(params,doSuccess);
  }
})