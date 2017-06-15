var api = require('../../utils/api.js');
Page({
  data: {
    position:{
      latitude:23.099994,
      longitude:113.324520
    },
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
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
    console.log('onLoad')
    var that = this
    //初始化定位
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);
        that.setData({
          'position.latitude': res.latitude,
          'position.longitude': res.longitude
        })
        function onSuccess(res){
          console.log(res);
          if (res.statusCode == 200){
            
            var markers =[];
            var list = res.data.pois;
            console.log(list);
            for (var i = 0; i < list.length;i++){
              let longtitude = list[i].location.split(',')[0];
              let lartitude = list[i].location.split(',')[1];

              var marker = {
                iconPath: "/resources/icon/map-marker.png",
                id: i,
                latitude: lartitude,
                longitude: longtitude,
                width: 25,
                height: 25
              };
              markers.push(marker);
            }
            console.log(markers);
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
  },
  controltap(e) {
    console.log(e.controlId)
    if(e.controlId == 1){
      wx.showToast({
        title: '定位成功',
        icon: 'success',
        duration: 1000
      })
    }else if(e.controlId == 2){
      wx.showToast({
        title: '添加商户',
        icon: 'success',
        duration: 1000
      })
    }
  }
})