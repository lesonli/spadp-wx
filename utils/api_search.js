var base = require('base.js');

/**
 * 搜索商户
 */
function searchShop(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/search/searchShop",
    data: {
      token: base.getToken(),
      keywords: params.keyword,
      adcode: params.adcode,
      page: params.page,
      shopType: params.shoptype
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
 * 搜索附近商户
 */
function getAroundShop(params, doSuccess, doFail) {
  return wx.request({
    url: base.getApiHost() + "api/search/getAroundShop",
    data: {
      token: base.getToken(),
      location: params.location,
      page: 1,
      shopType: 0
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
  getAroundShop: getAroundShop,
  searchShop: searchShop
}