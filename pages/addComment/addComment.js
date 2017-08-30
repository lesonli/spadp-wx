// addComment.js 
var api_shop = require('../../utils/api_shop.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rating:{
      stars: [0, 1, 2, 3, 4],
      normalSrc: 'https://spadp-images.oss-cn-beijing.aliyuncs.com/resources/icon/star_empty.png',
      selectedSrc: 'https://spadp-images.oss-cn-beijing.aliyuncs.com/resources/icon/star_full.png',
      halfSrc: 'https://spadp-images.oss-cn-beijing.aliyuncs.com/resources/icon/star_half.png',
      score: 0,//评分
      index:0
    },
    ratingText: ['超烂啊', '比较差','一般般', '比较好', '完美'],
    disableSubmit:false,
    content:"",
    shop_id:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shop_id && options.shop_id != "") {
      this.setData({
        shop_id: options.shop_id
      })
    }
  },
  changeRating:function(e){
    var key = e.currentTarget.dataset.key
    if (this.data.rating.score == 0.5 && key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      'rating.score': key,
      'rating.index': parseInt(key-0.5)
    })
  },
  lineChange:function(e){
    var that = this;
    if(e.detail.lineCount >10){
      wx.showModal({
        title: '提示',
        content: '评论信息最多输入10行！',
        showCancel:false,
        success: function (res) {
          that.setData({
            'disableSubmit': true
          })
        }
      })
    } else {
      if (this.data.disableSubmit){
        this.setData({
          'disableSubmit': false
        })
      }
    }
  },
  textChange:function(e){
    this.setData({
      'content': e.detail.value
    })
  },
  submit:function(e){
    var content = this.data.content.replace(/\n/g,'');
    if (content.length < 10){
      wx.showModal({
        title: '提示',
        content: '评论信息至少10个字！',
        showCancel: false
      })
      return;
    }
    if (content.length > 200) {
      wx.showModal({
        title: '提示',
        content: '评论信息最多200个字！',
        showCancel: false
      })
      return;
    }
    var params = {};
    params.shop_id = this.data.shop_id;
    params.rating = this.data.rating.score;
    params.content = this.data.content;
    function doSuccess(res){
      if(res.res_code == 1){
        wx.showModal({
          title: '提示',
          content: '添加成功！',
          showCancel: false,
          success:function(e){
            wx.navigateBack();
          }
        })
      }else{
        wx.showModal({
          title: '添加失败！',
          content: res.msg,
          showCancel: false
        })
      }
    }
    api_shop.addComment(params, doSuccess);
  }
})