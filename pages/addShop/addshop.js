// addshop.js
const time = []
for (let i = 0; i < 24; i++) {
  if (i >= 0 && i <= 6) {
    time.push("凌晨" + i + "点");
  } else if (i > 6 && i < 12) {
    time.push("上午" + i + "点");
  } else if (i == 12) {
    time.push("中午" + i + "点");
  } else if (i > 12 && i < 19) {
    time.push("下午" + i + "点");
  } else if (i >= 19 && i <= 23) {
    time.push("晚上" + i + "点");
  }
}
var base = require('../../utils/base.js');
var api_map = require('../../utils/api_map.js');
var api_shop = require('../../utils/api_shop.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {
      adcode: "",
      address: "",
      businessAreas: "",
      citycode: "",
      district: "",
      location: "",
      province: "",
      name: "",
      latitude: "",
      longitude: "",
      shopType: 0,
      tel: "",
      openTime: "中午12点 至 晚上22点",
      photo_url: "",
      show_photo_url:""
    },
    showClear: false,
    shopTypeList: [],
    isShowPicker: false,
    time: time,
    value: [9, 0, 0]
  },
  chooseLocation: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'shopInfo.latitude': res.latitude,
          'shopInfo.longitude': res.longitude,
        })
        api_map.getRegeocode(res, function (mapInfo) {
          if (mapInfo.status == "1") {
            var businessAreas = "";
            if (mapInfo.regeocode.addressComponent.businessAreas.length > 0) {
              mapInfo.regeocode.addressComponent.businessAreas.forEach(function (v, i, a) {
                if (i == 0) {
                  businessAreas = v.name;
                } else {
                  businessAreas += ";" + v.name;
                }
              });
            }
            that.setData({
              'shopInfo.address': mapInfo.regeocode.formatted_address,
              'shopInfo.adcode': mapInfo.regeocode.addressComponent.adcode,
              'shopInfo.province': mapInfo.regeocode.addressComponent.province,
              'shopInfo.adcode': mapInfo.regeocode.addressComponent.adcode,
              'shopInfo.district': mapInfo.regeocode.addressComponent.district,
              'shopInfo.citycode': mapInfo.regeocode.addressComponent.citycode,
              'shopInfo.businessAreas': businessAreas,
              'shopInfo.location': base.toLocation(res),
              showClear: true
            })
          } else {
            that.setData({
              'shopInfo.address': res.address,
              showClear: true
            })
          }
        });
      }
    })
  },
  bindShopName: function (e) {
    this.setData({
      'shopInfo.name': e.detail.value
    })
  },
  bindShopAddress: function (e) {
    this.setData({
      'shopInfo.address': e.detail.value
    })
    //不为空显示按钮
    if (e.detail.value != '') {
      this.setData({
        showClear: true
      })
    } else {
      this.setData({
        showClear: false
      })
    }
  },
  clearAddress: function (e) {
    this.setData({
      'shopInfo.address': "",
      showClear: false
    })
  },
  bindShopTel: function (e) {
    this.setData({
      'shopInfo.tel': e.detail.value
    })
  },
  showPicker: function (e) {
    this.setData({
      isShowPicker: !this.data.isShowPicker
    })
  },
  /**
   * 修改营业时间
   */
  confirmOpenTime: function (e) {
    var val = this.data.value;
    var openTime = this.data.time[val[0]] + " 至 " + this.data.time[val[2]];
    this.setData({
      'shopInfo.openTime': openTime,
      isShowPicker: !this.data.isShowPicker
    })
  },
  /**
   * 修改营业时间
   */
  changeOpenTime: function (e) {
    this.setData({
      'value': e.detail.value
    })
  },
  /**
   * 修改商户类型
   */
  changeShopType: function (e) {
    this.setData({
      'shopInfo.shopType': e.detail.value
    })
  },
  addPhoto: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
        var tempFilePaths = res.tempFilePaths[0];
        that.setData({
          'shopInfo.show_photo_url': tempFilePaths
        })
      }
    })
  },
  /**
   * 提交数据
   */
  submit: function (e) {
    if (this.data.shopInfo.name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写商户名称！',
        showCancel: false
      })
      return;
    }
    if (this.data.shopInfo.address == "") {
      wx.showModal({
        title: '提示',
        content: '请定位商户地址！',
        showCancel: false
      })
      return;
    }
    if (this.data.shopInfo.show_photo_url == ""){
      wx.showModal({
        title: '提示',
        content: '请添加照片！',
        showCancel:false
      })
      return;
    }
    var that = this;
    api_shop.checkShopByName(that.data.shopInfo,function(shopInfo){
      if (shopInfo.res_code == 1 && shopInfo.msg.length > 0){
        wx.showModal({
          title: '提示',
          content: that.data.shopInfo.province + "已经存在一家" + that.data.shopInfo.name+ "了，如果您添加的是分店，请在名称加入(xxx分店)后缀",
          showCancel:false,
          success: function (res) {
          }
        })
        return;
      }else{
        //上传照片
        wx.showLoading({
          title: '上传照片中',
        })
        base.uploadImg(that.data.shopInfo.show_photo_url, 'shop', function (img_url) {
          that.setData({
            'shopInfo.photo_url': img_url
          })
          wx.showLoading({
            title: '添加商户中',
          })
          //添加商户
          api_shop.addShop(that.data.shopInfo, function (res) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '添加商户成功！',
              showCancel: false,
              success: function (res) {
                wx.navigateBack();
              }
            })
          }, function (error) {
            wx.hideLoading();
            wx.showToast({
              title: '添加失败!',
              icon: 'warn',
              duration: 1500
            })
          });
        }, function (error) {
          wx.hideLoading();
          wx.showToast({
            title: '上传失败!',
            icon: 'warn',
            duration: 1500
          })
        });
      }
    });
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取分类列表
    this.setData({
      'shopTypeList': app.globalData.shopTypeList
    })
  }
})