var WxSearch = require('../../wxSearchView/wxSearchView.js');
import initCalendar from '../common/calendar/index';
import { jump } from '../common/calendar/index';
var util = require('../../util/util.js')

Page({
  data: {
    startDate: null,
    endDate: null,
    startId: null,
    keyword: null,
    isStartDate: true, // 标记位，日期选择的是否是开始时间，默认是
    isShowCalendar: false, // 默认不展示日历框
    messageList: [],
    canManage:false,
    showExport:false,
    showPlus: false,
    hiddenmodalput: true
  },

  afterTapDay: function (currentSelect) {
    console.log(currentSelect);

    var isStartDate = this.data.isStartDate;
    var date = currentSelect.year + '/' + currentSelect.month + '/' + currentSelect.day;
    if (isStartDate) {
      this.setData({
        startId:null,
        startDate: date
      })
    } else {
      this.setData({
        startId: null,
        endDate: date
      })
    }

    this.mySearchFunction(this.data.keyword);
  },

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    this.pageSearch();
  },

  onShow: function () {
    this.pageSearch();
  },

  // 搜索栏
  onLoad: function () {
    var that = this;
    
    initCalendar({
      afterTapDay: function (currentSelect) {

        that.afterTapDay(currentSelect);
      }
    });

    WxSearch.init(
      that,  // 本页面一个引用
      ['杭州', '嘉兴', "海宁", "桐乡", '宁波', '金华', "绍兴", '上海', '苏州'], // 热点搜索推荐，[]表示不使用
      ['杭州', '嘉兴', "海宁", "桐乡", '宁波', '金华', "绍兴", '上海', '苏州', '无锡', '常州', "南京", "济南", "长沙", "北京", "广州", '厦门', "香港", "澳门", "深圳"],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction, //提供一个返回回调函数
      that.wxExportFunction
    );
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    var startDate = new Date();
    this.setData({
      startDate: startDate.getFullYear() + '/' + startDate.getMonth() + '/' + startDate.getDate(),
      endDate: endDate.getFullYear() + '/' + (endDate.getMonth()+1) + '/' + endDate.getDate(),
      canManage: getApp().globalData.canManage
    })

    this.mySearchFunction(null);
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数
  wxExport: WxSearch.wxExport,

  // 搜索回调函数  
  mySearchFunction: function (value) {
    this.setData({
      startId: null,
      keyword: value
    })
    var request = {}
    request.startId = null;
    request.len = 15;
    request.keyword = value;
    request.startDateStr = this.data.startDate;
    request.endDateStr = this.data.endDate;
    console.log(request);
    var that = this;
    util.doPost({
      url: getApp().globalData.serviceHost + '/search/messageList',
      data: request,
      success: function (messaageList) {
        
        var startId = that.data.startId;
        if(messaageList && messaageList.length>0) {
          startId = messaageList[messaageList.length-1].id;
          
        }
        that.setData({
          messageList: messaageList,
          startId: startId
        })
      }
    })
  },

  pageSearch: function () {
    var request = {}
    request.startId = this.data.startId;
    request.len = 15;
    request.keyword = this.data.keyword;
    request.startDateStr = this.data.startDate;
    request.endDateStr = this.data.endDate;
    console.log(request);
    var that = this;
    util.doPost({
      url: getApp().globalData.serviceHost + '/search/messageList',
      data: request,
      success: function (messaageList) {
        var originalMessageList = that.data.messageList;
        var startId = that.data.startId;
        if (messaageList && messaageList.length > 0) {
          startId = messaageList[messaageList.length - 1].id;
          for (var i = 0; i < messaageList.length; i++) {
            originalMessageList.push(messaageList[i]);
          }
        }
        that.setData({
          messageList: originalMessageList,
          startId: startId
        })
      }
    })
  },
  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 跳转

  },

  wxExportFunction: function () {
    console.log("export company")
  },

  showCalendar: function (e) {
    var fromOrTo = e.currentTarget.dataset.idx;

    var isShow = !this.data.isShowCalendar;
    var isStartDate = this.data.isStartDate;
    if (isShow) {
      if (fromOrTo == 'from') {
        isStartDate = true;
      }
      if (fromOrTo == 'to') {
        isStartDate = false;
      }
    }
    this.setData(
      {
        isShowCalendar: isShow,
        isStartDate: isStartDate
      }
    )
  }
})