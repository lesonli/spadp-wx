var base = require('../../utils/base.js');
var api_search = require('../../utils/api_search.js');
var app = getApp();
Page({
  data: {
    position: {
      latitude: 23.099994,
      longitude: 113.324520
    },
    loading:false,
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/resources/icon/location_center.png',
      position: {
        left: 10,
        top: 300,
        width: 35,
        height: 35
      },
      clickable: true
    }, {
      id: 2,
      iconPath: '/resources/icon/add.png',
      position: {
        left: 10,
        top: 300,
        width: 60,
        height: 60
      },
      clickable: true
    }]
  },
  onLoad: function () {
    var that = this
    that.setData({
      'loading': true
    })
    app.getUserLocation(function(res){
      that.setData({
        'position.latitude': res.latitude,
        'position.longitude': res.longitude
      })
      var params = {};
      params.location = base.toLocation(res);
      api_search.getAroundShop(params, that.onSuccess);
    });
    //设置控件位置
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          'controls[0].position.top': res.windowHeight - 60,
          'controls[1].position.left': res.windowWidth - 80,
          'controls[1].position.top': res.windowHeight - 80,
        })
      }
    })
  },
  onSuccess(res) {
    if (res.res_code == 1) {
      var markers = [];
      var list = res.msg;
      for (var i = 0; i < list.length; i++) {
        let longtitude = list[i].location.split(',')[0];
        let latitude = list[i].location.split(',')[1];
        let name = list[i].name;
        var marker = {
          iconPath: "/resources/icon/map-marker.png",
          id: i,
          latitude: latitude,
          longitude: longtitude,
          width: 30,
          height: 30,
          shop_id: list[i].shop_id,
          sid: list[i].sid,
          title: name,
          callout: {
            content: name,
            color: "#5677fc",
            borderRadius: 5,
            fontSize: 14,
            padding: 5,
            display: 'ALWAYS'
          }
        };
        markers.push(marker);
      }
      this.setData({
        'markers': markers,
        'loading':false
      })
    }
  },
  regionchange(e) {
  },
  markertap(e) {
    wx.navigateTo({
      url: '../shopDetail/shopdetail?shop_id=' + this.data.markers[e.markerId].shop_id +
      "&sid=" + this.data.markers[e.markerId].sid
    })
  },
  controltap(e) {
    var that = this
    if (e.controlId == 1) {
      if(that.data.loading){
        return;
      }
      that.setData({
        'loading': true
      })
      wx.showLoading({
        title: '定位中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 5000);
      app.getUserLocation(function (res) {
        that.setData({
          'position.latitude': res.latitude,
          'position.longitude': res.longitude
        })
        wx.hideLoading()
        wx.showToast({
          title: '定位成功',
          icon: 'success',
          duration: 800
        })
        var params = {};
        params.location = base.toLocation(res);
        api_search.getAroundShop(params, that.onSuccess);
      });
    } else if (e.controlId == 2) {
      wx.navigateTo({
        url: '../addShop/addshop'
      })
    } else if (e.controlId == 3) {
      var display = "ALWAYS";
      if (this.data.markers[0].callout.display == "ALWAYS") {
        display = "BYCLICK";
      }
      var markers_new = this.data.markers;
      for (var i = 0; i < this.data.markers.length; i++) {
        markers_new[i].callout.display = display;
      }
      that.setData({
        'markers': markers_new
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})