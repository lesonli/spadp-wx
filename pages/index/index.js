//index.js
//获取应用实例
var api_shop = require('../../utils/api_shop.js');
var api_map = require('../../utils/api_map.js');
var app = getApp()
Page({
  data: {
    userInfo: {},
    address:"定位中...",
    tags: ["spa", "华夏良子", "洗浴中心"],
    shopTypeList:[],
    shopItem: {
      name: "test",
      rating:"50",
      renjun: "100",
      district: "chaoyang",
      tags: "xx xx xx"
    },
    hot_search_historys:[],
    hotShopList:[]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  search: function (event) {
    if (event.currentTarget.dataset.keyword !=''){
      wx.navigateTo({
        url: '../shopList/shoplist?keyword=' + event.currentTarget.dataset.keyword + '&shoptype=0'
      })
    }else{
      wx.navigateTo({
        url: '../shopList/shoplist'
      })
    }
  },
  searchByType:function(e){
    if (e.currentTarget.dataset.shoptype ==3){
      wx.showModal({
        title: '提示',
        content: '该类型暂未开放',
        showCancel:false,
        success: function (res) {
         
        }
      })
    }else{
      wx.navigateTo({
        url: '../shopList/shoplist?keyword=' + e.currentTarget.dataset.keyword + '&shoptype=' + e.currentTarget.dataset.shoptype
      })
    }
  },
  /**
  * 跳转详情页
  */
  goDetail: function (e) {
    if (e.currentTarget.dataset.id == "" && e.currentTarget.dataset.sid == "") {
      wx.showToast({
        title: '不存在详情信息！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    wx.navigateTo({
      url: '../shopDetail/shopdetail?shop_id=' + e.currentTarget.dataset.id +
      "&sid=" + e.currentTarget.dataset.sid
    })
  },
  onLoad: function () {
    this.initData();
  },
  initData:function(){
    var that = this
    app.getUserLocation(function (res) {
      console.log(res);
      that.setData({
        address: res.address
      })
      api_shop.getHotShop(res.district,function (res) {
        if (res.res_code == 1) {
          that.setData({
            hotShopList: api_shop.formatShopList(res.msg)
          })
        }
      });
    })
    
    //获取热门搜索
    api_map.getHotSearch(function (data) {
      if (data.res_code == 1) {
        that.setData({
          hot_search_historys: data.msg
        })
      }
    });
    that.setData({
      shopTypeList: app.globalData.shopTypeList
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData();
    setTimeout(function(){
      wx.stopPullDownRefresh();
    },2000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
