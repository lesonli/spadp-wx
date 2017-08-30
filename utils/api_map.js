const HOST = "https://restapi.amap.com/";
var base = require('base.js');
const KEY = '040fe1ba962b94e8b4c7251ce1ac33db';

/**
 * 获取附近的商户
 */
function getAround(params, doSuccess, doFail, doComplete) {
  return wx.request({
    url: HOST + "v3/place/around", //仅为示例，并非真实的接口地址
    data: {
      key: KEY,
      location: params.latitude + "," + params.longitude,
      types: '071400',
      extensions: "all",
      radius: 3000
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(res);
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
/**
 * 设置搜索日志
 */
function setSearchLog(params) {
  wx.request({
    url: base.getApiHost() + "api/search/setLog",
    method: "POST",
    data: {
      token: base.getToken(),
      types: '071400',
      keyword: params.keyword,
      page: params.page,
      city: params.district
    }
  });
}
/**
 * 检测关键词是否被搜索
 */
function getSearchCount(params, doSuccess, doFail) {
  wx.request({
    url: base.getApiHost() + "api/search/getSearchCount",
    method: "POST",
    data: {
      token: base.getToken(),
      keyword: params.keyword,
      page: params.page,
      city: params.district
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(base.formatResponse(res));
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    }
  });
}
/**
 *同步商户数据
 */
function syncShop(params, data) {
  //
  getSearchCount(params, function (res) {
    //设置搜索历史
    setSearchLog(params);
    if (res.msg == 0) {
      var shopList = [];
      data.pois.forEach(function (v) {
        var shop = {};
        shop.sid = v.id;
        shop.name = v.name;
        shop.location = v.location;
        if (v.photos.length > 0) {
          shop.photo_url = v.photos[0].url;
        } else {
          shop.photo_url = "";
        }
        shop.longitude = v.location.split(',')[0];
        shop.latitude = v.location.split(',')[1];
        shop.address = v.address;
        shop.adcode = v.adcode;
        shop.district = v.adname;
        if (typeof v.biz_ext.rating == "string") {
          shop.rating = v.biz_ext.rating;
        } else {
          shop.rating = "";
        }
        if (typeof v.biz_ext.cost == "string") {
          shop.cost = v.biz_ext.cost;
        } else {
          shop.cost = "";
        }
        if (typeof v.business_area == "string") {
          shop.businessAreas = v.business_area;
        } else {
          shop.businessAreas = "";
        }
        shop.citycode = v.citycode;
        shop.cityname = v.cityname;
        shop.province = v.pname;
        if (typeof v.tel == "string") {
          shop.tel = v.tel;
        } else {
          shop.tel = "";
        }
        shop.openTime = "";
        shop.typecode = v.typecode;
        shop.shopType = "0";
        shopList.push(shop);
      });
      //同步数据
      wx.request({
        url: base.getApiHost() + "api/search/syncShop",
        method:'POST',
        data: {
          token: base.getToken(),
          shopList: shopList
        }
      });
    }
  });
}
/**
 * 获取热门搜索
 */
function getHotSearch(doSuccess, doFail){
  //返回搜索结果
  return wx.request({
    url: base.getApiHost() + "api/search/hotSearch",
    data: {
      token: base.getToken(),
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(base.formatResponse(res));
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    }
  })
}
/**
 * 搜索商户
 */
function search(params, doSuccess, doFail, doComplete) {
  //返回搜索结果
  return wx.request({
    url: HOST + "v3/place/text", //仅为示例，并非真实的接口地址
    data: {
      key: KEY,
      types: '071400',
      keywords: params.keyword,
      //offset: params.offset,
      page: params.page,
      city: params.district,
      extensions: "all",
      citylimit: true
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(res);
        //同步商户数据到mysql
        syncShop(params, res.data);
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
/**
 * 获取单个商户详情
 */
function getShopDetail(id, doSuccess, doFail, doComplete) {
  return wx.request({
    url: HOST + "v3/place/detail", //仅为示例，并非真实的接口地址
    data: {
      key: KEY,
      id: id
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(res);
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
/**
 * 获取行政区
 */
function getDistrict(keyword, doSuccess, doFail, doComplete) {
  return wx.request({
    url: HOST + "v3/config/district",
    data: {
      key: KEY,
      keywords: keyword,
      subdistrict: 0
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(res);
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
/**
 * 坐标转地址
 */
function getRegeocode(params, doSuccess, doFail, doComplete) {
  return wx.request({
    url: HOST + "v3/geocode/regeo", //仅为示例，并非真实的接口地址
    data: {
      key: KEY,
      location: params.longitude + "," + params.latitude
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        if (res.statusCode == 200) {
          doSuccess(res.data);
        }
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
module.exports = {
  getAround: getAround,
  getShopDetail: getShopDetail,
  getRegeocode: getRegeocode,
  search: search,
  getDistrict: getDistrict,
  getHotSearch: getHotSearch
}