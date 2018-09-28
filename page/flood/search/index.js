
import initCalendar from '../../common/calendar/index';
var WxSearch = require('../../../wxSearchView/wxSearchView.js');
import { jump } from '../../common/calendar/index';
var util = require('../../../util/util.js')
Page({
  data: {
    startDate: null,
    endDate: null,
    startId: null,
    keyword: null,
    isStartDate: true, // 标记位，日期选择的是否是开始时间，默认是
    isShowCalendar: false, // 默认不展示日历框
    situationList: [],
    canManage: false,
    showExport: true,
    showPlus:true,
    hiddenmodalput: true,
    showModalStatus: false
  },

  afterTapDay: function (currentSelect) {
    console.log(currentSelect);

    var isStartDate = this.data.isStartDate;
    var date = currentSelect.year + '/' + currentSelect.month + '/' + currentSelect.day;
    if (isStartDate) {
      this.setData({
        startDate: date
      })
    } else {
      this.setData({
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

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.mySearchFunction(this.data.keyword);
  },
  
  onShow: function () {
    this.mySearchFunction(this.data.keyword);
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
      startDate: startDate.getFullYear() + '/' + (startDate.getMonth()+1) + '/' + startDate.getDate(),
      endDate: endDate.getFullYear() + '/' + (endDate.getMonth()+1) + '/' + endDate.getDate(),
      canManage: getApp().globalData.canManage
    })
    // 不传入参数则默认跳转至今天
    // jump();
    // 入参必须为数字
    // jump(2018, 6); // 跳转至2018-6
    // jump(2018, 6, 6); // 跳转至2018-6-6
    
    console.log(startDate.toLocaleDateString());
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

    var request = {}
    request.startId = null;
    request.len = 15;
    request.keyword = value;
    request.startDateStr = this.data.startDate;
    request.endDateStr = this.data.endDate;
    console.log(request);
    this.setData({
      startId: null,
      keyword: value
    })
    var that = this;
    util.doPost({
      url: getApp().globalData.serviceHost + '/search/situationList',
      data: request,
      success: function (floodSituationList) {
        var startId = that.data.startId;
        
        if (floodSituationList && floodSituationList.length > 0) {
          startId = floodSituationList[floodSituationList.length - 1].id;
          
        }
        that.setData({
          situationList: floodSituationList,
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
      url: getApp().globalData.serviceHost + '/search/situationList',
      data: request,
      success: function (floodSituationList) {
        var startId = that.data.startId;
        var originalList = that.data.situationList;
        if (floodSituationList && floodSituationList.length > 0) {
          startId = floodSituationList[floodSituationList.length - 1].id;
          for (var i = 0; i < floodSituationList.length; i++) {
            originalList.push(floodSituationList[i]);
          }
        }
        that.setData({
          situationList: originalList,
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

  wxAddItem: function () {
    wx.navigateTo({
      url: '../edit/index?canManage=true',
    })
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
  },
  wxExportFunction: function () {
    var showModalStatus = this.data.showModalStatus;
    var currentStatu = "close";
    if (!showModalStatus) {
      currentStatu = "open";
    }
    this.util(currentStatu)
  },

  onContentInput: function (e) {
    var emails = e.detail.value;
    console.log(emails);
    this.setData({
      emails: emails
    })
  },

  //确认  
  exportConfirm: function () {
    var emails = this.data.emails;
    if (!emails || emails == '') {
      wx.showToast({
        title: '邮箱不能为空',
      });
      return;
    }
    var that = this;
    var request = {}
    request.keyword = this.data.keyword;
    request.startDateStr = this.data.startDate;
    request.endDateStr = this.data.endDate;
    request.emails = emails;
    util.doPost({
      url: getApp().globalData.serviceHost + "/manage/exportFlood",
      data: request,
      success: function (companyList) {
        wx.showToast({
          title: '导出成功',
        });
        that.util('close')
      }
    })
    wx.showToast({
      title: '导出中',
      icon: 'loading',
      duration: 10000
    })
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    if (currentStatu == 'confirm') {
      this.exportConfirm();
    } else {
      this.util(currentStatu)
    }
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      if (currentStatu == 'confirm') {
        this.exportConfirm();
      }
      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  } 
})