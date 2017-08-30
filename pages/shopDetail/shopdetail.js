// shopdetail.js
var api_shop = require('../../utils/api_shop.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo:{
      name:"未知",
      shoptype:"未知",
      district:"未知",
      tags: "未知",
      rating:0,
      ratingclass:"star-0",
      cost:"未知",
      address:"未知",
      tel:"未知",
      photos:[],
      latitude:61,
      longtitude:139
    },
    shopCommentList:[],
    pageInfo:{
      page_index:0,
      page_size:10
    },
    shop_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.shop_id != ""){
        wx.showLoading({
          title: '加载中',
        })
        this.setData({
          shop_id: options.shop_id
        });
        this.initData();
        app.getUserLocation(function (res) {
          api_shop.visitShop(options.shop_id,1,res);
        });
      }
  },
  initData:function(){
    var that = this;
    function showShopInfo(res) {
      wx.hideLoading();
      if (res.res_code == 1) {
        that.setData({
          shopInfo: api_shop.formatShop(res.msg)
        })
      }
    }
    function showCommentList(res) {
      if (res.res_code == 1) {
        that.setData({
          shopCommentList: res.msg
        })
      }
    }
    var params = {};
    params.shop_id = this.data.shop_id;
    params.page_index = this.data.pageInfo.page_index;
    params.page_size = this.data.pageInfo.page_size;
    if (params.shop_id != 0) {
      api_shop.getShopInfo(params, showShopInfo);      
      api_shop.getShopCommentList(params, showCommentList);
    }
  },
  goLocation:function(e){

    var location = e.currentTarget.dataset.location;
    if(location !=""){
      wx.openLocation({
        latitude: Number(location.split(",")[1]),
        longitude: Number(location.split(",")[0]),
        name:this.data.shopInfo.name,
        address: this.data.shopInfo.address,
        scale: 28
      })
    }
  },
  AddComment:function(e){
    wx.navigateTo({
      url: '../addComment/addComment?shop_id=' + this.data.shopInfo.id
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})