var host = getApp().config.host;
function getAround(params,doSuccess,doFail,doComplete){
  return wx.request({
    url: host +"v3/place/around", //仅为示例，并非真实的接口地址
    data: {
      key: '040fe1ba962b94e8b4c7251ce1ac33db',
      location: params.latitude + "," + params.longitude,
      types:'071400',
      extensions:'all'
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

module.exports.getAround = getAround;