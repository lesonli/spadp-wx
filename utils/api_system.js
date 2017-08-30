var base = require('base.js');

/**
 * 用户添加留言信息
 */
function addContactInfo(params, doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/system/addContactInfo",
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
/**
 * 获取app信息
 */
function getAppInfo(doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/system/getAppInfo",
    data: {
      token: base.getToken()
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
/**
 * 获取app更新日志
 */
function getUpdateLog(doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/system/getUpdateLog",
    data: {
      token: base.getToken()
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
/**
 * 获取app相关问题
 */
function getQuestions(doSuccess, doFail, doComplete) {
  return wx.request({
    url: base.getApiHost() + "api/system/getQuestions",
    data: {
      token: base.getToken()
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
  getAppInfo: getAppInfo,
  addContactInfo: addContactInfo,
  getUpdateLog: getUpdateLog,
  getQuestions:getQuestions
}