var base = require('base.js');
/**
* 格式化商店列表
*/
function formatShopList(list) {
  for (var i = 0; i < list.length; i++) {
    list[i] = this.formatShop(list[i]);
  }
  return list;
}
/**
* 格式化商店
*/
function formatShop(shop) {
  if (shop.cost == "") {
    shop.renjun = "";
  } else {
    shop.renjun = "¥" + shop.cost + "/人";
  }
  var class_rating = 0;
  if (shop.rating > 4.5 && shop.rating <= 5.0) {
    class_rating = 50;
  } else if (shop.rating > 4.0 && shop.rating <= 4.5) {
    class_rating = 45;
  } else if (shop.rating > 3.5 && shop.rating <= 4.0) {
    class_rating = 40;
  } else if (shop.rating > 3.0 && shop.rating <= 3.5) {
    class_rating = 35;
  } else if (shop.rating > 2.0 && shop.rating <= 3.0) {
    class_rating = 30;
  } else if (shop.rating > 1.0 && shop.rating <= 2.0) {
    class_rating = 20;
  } else {
    class_rating = 0;
  }
  shop.rating = class_rating;
  if (shop.businessAreas != "") {
    let tmp = shop.businessAreas.split('|')[0];
    shop.district += "/" + tmp;
  }
  return shop;
}
/**
 * 添加商户
 */
function addShop(params, doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/shop/addShop",
    method:"POST",
    data: {
      token: base.getToken(),
      adcode: params.adcode,
      address: params.address,
      businessAreas: params.businessAreas,
      citycode: params.citycode,
      typecode: "0071400",
      district: params.district,
      location: params.location,
      province: params.province,
      name: params.name,
      latitude: params.latitude,
      longitude: params.longitude,
      shopType: params.shopType,
      tel: params.tel,
      openTime: params.openTime,
      photo_url: params.photo_url
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
/**
 * 添加商户评论
 */
function addComment(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/addComment",
    method: "POST",
    data: {
      token: base.getToken(),
      shop_id: params.shop_id,
      rating: params.rating,
      content: params.content
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 获取商户信息
 * */
function getShopInfo(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/getShopInfo",
    data: {
      token: base.getToken(),
      shop_id: params.shop_id,
      sid: params.sid,
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 获取商户评论列表
 * */
function getShopCommentList(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/getCommentList",
    data: {
      token: base.getToken(),
      shop_id: params.shop_id,
      page_index: params.page_index,
      page_size: params.page_size
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 检测是否存在同名商户
 * */
function checkShopByName(params, doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/shop/checkShopByName",
    data: {
      token: base.getToken(),
      name: params.name,
      citycode: params.citycode,
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
/**
 * 记录访问该商户的日志
 * */
function visitShop(shop_id,origin,location) {
  return wx.request({
    url: base.getApiHost() + "api/shop/visitShop",
    data: {
      token: base.getToken(),
      shop_id: shop_id,
      origin: origin,
      adcode: location.adcode,
      latitude: location.latitude,
      longitude: location.longitude
    }
  })
}
/**
 * 获取热门商户
 * */
function getHotShop(district,doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/getShopListByVisitCount",
    data: {
      token: base.getToken(),
      district: district
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 获取商户tag标签列表
 * */
function getShopTags(shop_id, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/getShopTags",
    data: {
      token: base.getToken(),
      shop_id: shop_id
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 获取商户动态数量
 * */
function getShopDyCount(shop_id, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/getShopDyCount",
    data: {
      token: base.getToken(),
      shop_id: shop_id
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 添加用户分享和举报评论的日志
 */
function addCommentLog(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/addCommentLog",
    method: "POST",
    data: {
      token: base.getToken(),
      sd_id: params.sd_id,
      content: params.content,
      type:params.type
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 添加用户动态，想去和去过
 */
function addUserDynamics(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/addUserDynamics",
    method: "POST",
    data: {
      token: base.getToken(),
      shop_id: params.shop_id,
      type: params.type
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 设置用户动态内容，想去和去过
 */
function setUserDynamicsInfo(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/setUserDynamicsInfo",
    method: "POST",
    data: {
      token: base.getToken(),
      shop_id: params.shop_id,
      type: params.type,
      rating:params.rating,
      content:params.content
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
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
 * 取消用户动态内容，想去和去过
 */
function cancelUserDynamics(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/shop/cancelUserDynamics",
    method: "POST",
    data: {
      token: base.getToken(),
      shop_id: params.shop_id,
      type: params.type
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        res = base.formatResponse(res);
        doSuccess(res);
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    }
  })
}
module.exports = {
  addShop: addShop,
  getShopInfo: getShopInfo,
  visitShop: visitShop,
  getHotShop: getHotShop,
  checkShopByName: checkShopByName,
  getShopCommentList: getShopCommentList,
  addComment: addComment,
  formatShopList: formatShopList,
  formatShop: formatShop,
  getShopTags: getShopTags,
  getShopDyCount: getShopDyCount,
  addCommentLog: addCommentLog,
  addUserDynamics: addUserDynamics,
  setUserDynamicsInfo: setUserDynamicsInfo,
  cancelUserDynamics: cancelUserDynamics
}