// shoplist.js
var api_map = require('../../utils/api_map.js');
var api_search = require('../../utils/api_search.js');
var api_shop = require('../../utils/api_shop.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoplist:[],
    search_historys: [],
    hot_search_historys:[],
    search_hots:[],
    districtList:[],
    shopTypeList:[],
    searchParams:{
      keyword:"",
      district:"",
      adcode:"",
      shoptype:0,
      page:1,
      count:0
    },
    loading:false,
    loaded:false,
    shopItem:{
      name:"test",
      renjun:"100",
      district:"chaoyang",
      tags:"xx xx xx"
    },
    showClearbtn:false,
    showFilterPannel:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取搜索历史
    var that = this;
    wx.getStorage({
      key: 'search_historys',
      success: function (res) {
        that.setData({
          search_historys: JSON.parse(res.data)
        })
      }
    })
    //获取热门搜索
    api_map.getHotSearch(function(data){

        if(data.res_code == 1){
          that.setData({
            hot_search_historys: data.msg
          })
        }
    });
    //获取分类列表
    that.setData({
      shopTypeList: app.globalData.shopTypeList
    })
    //获取行政区域列表
    app.getUserLocation(function(res){

      that.setData({
        'searchParams.adcode': res.adcode,
        'searchParams.district': res.district
      });
      api_map.getDistrict(res.citycode,function(result){
        if (result.statusCode == 200){

          that.setData({
            districtList: result.data.districts.filter((v) => { 
              return (v.level == "province" || v.level == "district")})
          })
          //设置区域
          that.setData({
            'filter.district': that.data.districtList[0].name
          })
          //设置搜索关键词
          if (options.keyword && options.keyword !='') {
            that.setData({
              'searchParams.keyword': options.keyword,
              showClearbtn: true
            })
          }
          //设置商户类型
          if (options.shoptype && options.shoptype >= 0 && options.shoptype <=3){
            that.setData({
              'searchParams.shoptype': options.shoptype
            })
            that.searchByParams('', ''); 
          }
        }
      });
    });
    //获取热门搜索

  },
  /**
   * 显隐clear按钮
   */
  bindReplaceInput:function(e){
      if (e.detail.value == "" && this.data.showClearbtn){
        this.setData({
          showClearbtn: false
        })
      }
      if (e.detail.value != "" && !this.data.showClearbtn){
        this.setData({
          showClearbtn: true
        })
      }
  },
  /**
   * 清空搜索栏
   */
  clear:function(e){
    this.setData({
      'searchParams.keyword': "",
      showClearbtn: false
    })
  },
  /**
   * 显示过滤面板
   */
  showFilter:function(e){
    if (this.data.showFilterPannel == e.currentTarget.dataset.filter){
      this.setData({
        showFilterPannel:0
      })
    }else{
      this.setData({
        showFilterPannel: e.currentTarget.dataset.filter
      })
    }
  },
  /**
   * 选择区域
   */
  chooseDistrict: function (e) {
    this.searchByParams('', e.currentTarget.dataset.adcode);
    this.setData({
      showFilterPannel: 0
    })
  },
  /**
   * 选择类别
   */
  chooseShopType:function(e){
    this.searchByParams('','',e.currentTarget.dataset.id);
    this.setData({
      showFilterPannel: 0
    })
  },
  /**
   * 清除搜索历史
   */
  deleteSearchHistorys:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否清空搜索历史？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            search_historys:[]
          })
          wx.setStorage({
            key: "search_historys",
            data: ""
          })
        }
      }
    })
  },
  /**
   * 跳转详情页
   */
  goDetail:function(e){
    if (e.currentTarget.dataset.id == "" && e.currentTarget.dataset.sid == ""){
      wx.showToast({
        title: '不存在详情信息！',
        icon: 'success',
        duration: 1500
      })
      return;
    }
    wx.navigateTo({
      url: '../shopDetail/shopdetail?shop_id=' + e.currentTarget.dataset.id +
      "&sid=" + e.currentTarget.dataset.sid
    })
  },
  /**
   * 设置搜索历史
   */
  setSearchHistory:function(){
    //添加历史搜索
    var sethistory = true;
    var search_historys = this.data.search_historys;
    var keyword = this.data.searchParams.keyword;
    if (keyword == "" || keyword == null || keyword == undefined){
      return;
    }
    for (var i = 0; i < search_historys.length; i++) {
      if (search_historys[i] == keyword) {
        sethistory = false;
      }
    }
    //如果需要添加历史记录
    if (sethistory) {
      search_historys.unshift(keyword);
      if (search_historys.length > 10) {
        search_historys.pop();
      }
      wx.setStorage({
        key: "search_historys",
        data: JSON.stringify(search_historys)
      })
      this.setData({
        search_historys: search_historys
      })
    }
  },
  /**
   * 搜索
   */
  setSearchList:function(params){
    var that = this;
    that.setData({
      loading: true
    })
    function doSuccess(res){

      if (res.res_code == 1){

        var shoplist = api_shop.formatShopList(res.msg);
        if(params.page == 1){
          //添加搜索历史
          that.setSearchHistory();
        }else{
          if(shoplist.length == 0){
            //如果列表为空，则没有更多数据
            that.setData({
              loaded: true
            })
          }
          shoplist = that.data.shoplist.concat(shoplist)
        }
        that.setData({
          shoplist: shoplist,
          loading: false
        })
      }
    }

    api_search.searchShop(params, doSuccess);
  },
  /**
   * 搜索方法
   */
  search:function(e){
    if (e.detail.value != ""){
      this.searchByParams(e.detail.value);
    }
  },
  /**
   * 按标签搜索
   */
  searchTag:function(e){
    this.setData({
      showClearbtn: true
    })
    this.searchByParams(e.currentTarget.dataset.keyword);
  },
  /**
   * 按参数搜索
   */
  searchByParams:function(keyword,adcode,shoptype){ 
    //设置关键词
    if (keyword!= ''){
      this.setData({
        'searchParams.keyword': keyword,
      })
    }
    //设置区域
    if (adcode && adcode != '') {
      this.setData({
        'searchParams.adcode': adcode,
      })
    }
    //设置类型
    if (shoptype) {
      this.setData({
        'searchParams.shoptype': shoptype,
      })
    }
    this.setData({
      'searchParams.page': 1,
      shoplist: [],
      laoded: false
    })
    this.setSearchList(this.data.searchParams);
  },
  /**
   * 搜索更多
   */
  loadmore:function(e){

    //读取中则返回
    if(this.data.loading){
      return;
    }
    //没有更多数据则返回
    if (this.data.loaded) {
      return;
    }
    this.setData({
      'searchParams.page': this.data.searchParams.page + 1
    })
    this.setSearchList(this.data.searchParams);
  },
})