var api = require('../../utils/api.js');
Page({
  data: {
    position:{
      latitude:23.099994,
      longitude:113.324520
    },
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
    //初始化定位
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          'position.latitude': res.latitude,
          'position.longitude': res.longitude
        })
        function onSuccess(res){
          if (res.statusCode == 200){
            
            var markers =[];
            var list = res.data.pois;
            for (var i = 0; i < list.length;i++){
              let longtitude = list[i].location.split(',')[0];
              let lartitude = list[i].location.split(',')[1];
              let name = list[i].name;
              var marker = {
                iconPath: "/resources/icon/map-marker.png",
                id: i,
                latitude: lartitude,
                longitude: longtitude,
                width: 25,
                height: 25,
                title:name,
                shopId: list[i].id,
                callout:{
                  content:name,
                  color:"#5677fc",
                  borderRadius:5,
                  fontSize:14,
                  padding:5,
                  display:'ALWAYS'
                }
              };
              markers.push(marker);
            }
            that.setData({
              'markers':markers
            })
          }
        }
        api.getAround(res,onSuccess);
      }
    })
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
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
    wx.navigateTo({
      url: '../shopDetail/shopdetail?shopid=' + this.data.markers[e.markerId].shopId
    })
  },
  controltap(e) {
    var that = this
    if(e.controlId == 1){
      wx.showLoading({
        title: '定位中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 5000);
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
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
        }
      })
    }else if(e.controlId == 2){
      /*wx.showModal({
        title: '提示',
        content: '这是一个模态弹窗',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })*/
      wx.navigateTo({
        url: '../addShop/addshop'
      })
    }
  }
})