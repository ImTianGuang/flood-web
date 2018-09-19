var WxSearch = require('../../wxSearchView/wxSearchView.js');
var util = require('../../util/util.js')

Page({
  data: {
    companyList:[],
    canManage: false,
    hiddenmodalput: true,
  },
 
  onShow: function () {
    this.onLoad();
  },
  
  // 搜索栏
  onLoad: function (options) {
    this.setData({
      canManage: getApp().globalData.canManage
    })
    var that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      [],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction, //提供一个返回回调函数
      that.wxExportFunction
    );
    this.mySearchFunction("");
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxExport: WxSearch.wxExport,
  wxSearchClear: WxSearch.wxSearchClear,

  // 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    var that = this;
    util.doGet({
      url: getApp().globalData.serviceHost + "/search/company",
      data: {
        companyName: value
      },
      success: function(companyList) {
        that.setData({
          companyList: companyList
        })
      }
    });
    console.log(value);
  },
  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 跳转
    
  },

  wxExportFunction: function () {
    console.log("export company")
    
  }
})