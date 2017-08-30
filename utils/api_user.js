var base = require('base.js');
/**
 * 获取用户信息
 */
function getUserInfo(doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/user/getUserInfo",
    data: {
      token: base.getToken()
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
 * 初始化用户信息
 */
function initUserInfoByWX(params, doSuccess, doFail, doComplete) {

  return wx.request({
    url: base.getApiHost() + "api/user/initUserInfoByWX",
    method: 'POST',
    data: {
      token: base.getToken(),
      avatarUrl: params.avatarUrl,
      city: params.city,
      gender: params.gender,
      province: params.province,
      nickName: params.nickName
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
 * 用户添加留言信息
 */
function addContactInfo(params, doSuccess, doFail, doComplete) {

  return wx.request({
    url: base.getApiHost() + "api/user/addContactInfo",
    method: 'POST',
    data: {
      token: base.getToken(),
      title: params.title,
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
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
}
module.exports = {
  getUserInfo: getUserInfo,
  initUserInfoByWX: initUserInfoByWX,
  addContactInfo: addContactInfo
}