// shopdetail.js
var api = require('../../utils/api.js');
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
    scrollTop: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.shopid)
      var that = this;
      function onSuccess(res){
        console.log(res);
        if (res.statusCode == 200 && res.data.count != 0){
          that.setData({
            'shopInfo.name': res.data.pois[0].name,
            'shopInfo.district': res.data.pois[0].adname,
            'shopInfo.address': res.data.pois[0].address,
          })
          if (res.data.pois[0].photos.length > 0){
            that.setData({
              'shopInfo.photos': res.data.pois[0].photos
            })
          }
          //人均花费
          if (typeof res.data.pois[0].biz_ext.cost == "string"){
            that.setData({
              'shopInfo.cost': "¥"+res.data.pois[0].biz_ext.cost
            })
          }
          //tel
          if (typeof res.data.pois[0].tel == "string") {
            that.setData({
              'shopInfo.tel': res.data.pois[0].tel
            })
          }
          //评分
          if (typeof res.data.pois[0].biz_ext.rating == "string") {
            var rating_class = "star-0";
            switch (res.data.pois[0].biz_ext.rating){
              case "5.0":
                rating_class = "star-50"
                break;
              case "4.5":
                rating_class = "star-45"
                break;                
              case "4.0":
                rating_class = "star-40"
                break;                
              case "3.5":
                rating_class = "star-35"
                break;                
              case "3.0":
                rating_class = "star-30"
                break;                
              case "2.0":
                rating_class = "star-20"
                break;                
              case "1.0":
                rating_class = "star-10"
                break;                
              default:
                rating_class = "star-0"
            }
            console.log(res.data.pois[0].biz_ext.rating);
            that.setData({
              'shopInfo.rating': res.data.pois[0].biz_ext.rating,
              'shopInfo.ratingclass': rating_class
            })
          }
        }
      }
      if (options.shopid != ""){
        api.getShopDetail(options.shopid,onSuccess);
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})