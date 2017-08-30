//app.js
var api_map = require('utils/api_map.js');
var base = require('utils/base.js');
var api_user = require('utils/api_user.js');
App({
  onLaunch: function (options) {
    this.globalData.scene = options.scene;
    //小程序启动检测登录
    base.checkToken();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //获取系统用户信息
      api_user.getUserInfo(function(userInfo){
        if(userInfo.res_code == 1){
          that.globalData.userInfo = userInfo.msg;
          typeof cb == "function" && cb(that.globalData.userInfo)
        }else{
          //不存在则获取微信数据，并保存
          wx.getUserInfo({
            success: function (res) {
              api_user.initUserInfoByWX(res.userInfo);
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  //获取位置信息，并保存
  getUserLocation: function (cb) {
    var that = this
    if (this.globalData.location) {
      typeof cb == "function" && cb(this.globalData.location)
    } else {
      //获取坐标
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var location = {}
          location.latitude = res.latitude;
          location.longitude = res.longitude;
          //解析坐标信息
          api_map.getRegeocode(res, function (mapInfo) {
            location.address = mapInfo.regeocode.formatted_address;
            location.province = mapInfo.regeocode.addressComponent.province;
            location.district = mapInfo.regeocode.addressComponent.district;
            location.adcode = mapInfo.regeocode.addressComponent.adcode;
            location.citycode = mapInfo.regeocode.addressComponent.citycode;
            that.globalData.location = location;
            typeof cb == "function" && cb(that.globalData.location)
          });
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    location: null,
    token:"",
    scene:"",
    shopTypeList: ['spa', '足疗按摩', '洗浴汗蒸', '上门服务']
  }
})