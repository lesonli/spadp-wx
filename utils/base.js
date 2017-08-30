//var HOST = "http://localhost:4005/";
var OSS_HOST_IMAGE = "https://spadp-images.oss-cn-beijing.aliyuncs.com/";
var HOST = "https://api.spadp.com/";
var TOKEN = "";

/**
 * 通过微信登陆
 */
function loginByWX() {
  return wx.login({
    success: function (res) {
      wx.request({
        url: HOST + "api/user/loginByWX",
        data: {
          code: res.code
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.res_code == 1) {
              saveToken(res.data.msg.wx_token);
            }
          }
        }
      })
    }
  });
}
/**
 * 检查token是否有效,失效则登录
 */
function checkToken() {
  return wx.request({
    url: HOST + "api/user/checkToken",
    data: {
      token: getToken()
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if(res.data.res_code < -900){
            loginByWX();
        }
      }
    },
    fail: function () {
      loginByWX();
    }
  })
}
//保存token
function saveToken(token) {
  wx.setStorage({
    key: "token",
    data: token
  });
  TOKEN = token;
}
//获取token
function getToken(){
  if(TOKEN == ''){
    TOKEN = wx.getStorageSync('token');
  }
  return TOKEN;
}
/**
 * 获取服务器host地址
 */
function getApiHost() {
  return HOST;
}
/**
 * 上传图片，商户和头像
 */
function uploadImg(path, dir, doSuccess, doFail, doComplete){
  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  var params = {};
  params.ext = path.substring(path.lastIndexOf('.') + 1);
  params.ext = params.ext.toLowerCase();
  if (params.ext == "png") {
    params.content_type = 'image/png';
  } else if (params.ext == "jpg" || params.ext == "jpeg") {
    params.ext = "jpg";
    params.content_type = 'image/jpeg';
  } else {
    wx.showToast({
      title: '只支持上传图片！',
      icon: 'success',
      duration: 1500
    })
    return;
  }
  params.bucket = "spadp-images";
  params.dir = dir;
  //获取签名
  getOssSign(params, function (signInfo) {
    if (signInfo.res_code == 1) {
      wx.uploadFile({
        url: OSS_HOST_IMAGE, //仅为示例，非真实的接口地址
        filePath: path,
        name: 'file',
        formData: {
          'key': signInfo.msg.filename,
          'OSSAccessKeyId': signInfo.msg.accessKeyID,
          'policy': signInfo.msg.policyBase64,
          'Signature': signInfo.msg.sign,
          'success_action_status': '200'
        },
        success: function (res) {
          if (res.statusCode == 200) {
            var img_url = OSS_HOST_IMAGE + signInfo.msg.filename;
            if (typeof doSuccess == "function") {
              doSuccess(img_url);
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
    }else{
      if (typeof doFail == "function") {
        doFail();
        return;
      }
    }
  });
}
/**
 * 获取阿里云oss签名
 */
function getOssSign(params, doSuccess, doFail, doComplete) {
  return wx.request({
    url: HOST + "api/ali_oss/get_sign",
    method: 'POST',
    data: {
      token: getToken(),
      content_type: params.content_type,
      bucket: params.bucket,
      dir: params.dir,
      ext: params.ext,
      type: "post"
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
          doSuccess(formatResponse(res));
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
//坐标转换格式
function toLocation(data){
  return data.longitude + "," + data.latitude;
}
//格式化结果
function formatResponse(res){
  if (res.statusCode == 200){
    return res.data;
  }else{
    return { res_code: -1, msg: res.statusCode}
  }
}



module.exports = {
  loginByWX: loginByWX,
  checkToken: checkToken,
  saveToken: saveToken,
  getApiHost: getApiHost,
  getToken: getToken,
  getOssSign: getOssSign,
  uploadImg: uploadImg,
  toLocation: toLocation,
  formatResponse: formatResponse
}