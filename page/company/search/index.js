var WxSearch = require('../../../wxSearchView/wxSearchView.js');
var util = require('../../../util/util.js')

Page({
  data: {
    companyList:[],
    canManage: false,
    showExport: true,
    showPlus: true,
    showModalStatus: false,
    keyword: "",
    emails: ""
  },
 
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.mySearchFunction(this.data.keyword);
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

  wxSearchClear: function () {
    this.setData({
      keyword: ""
    })
    mySearchFunction(null);
  },
  // 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    this.setData({
      keyword: value
    })
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

  wxAddItem: function () {
    wx.navigateTo({
      url: '../edit/index?id=-1&fromManage=true',
    })
  },

  wxExportFunction: function () {
    var showModalStatus = this.data.showModalStatus;
    var currentStatu = "close";
    if (!showModalStatus) {
      currentStatu = "open";
    }
    this.util(currentStatu);
  },

  onContentInput: function (e) {
    var emails = e.detail.value;
    console.log(emails);
    this.setData({
      emails: emails
    })
  },
  //取消按钮  
  exportCancel: function () {
    this.setData({
      hiddenmodalput: true,
      emails: ""
    });
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
    util.doGet({
      url: getApp().globalData.serviceHost + "/manage/exportCompany",
      data: {
        emails: emails
      },
      success: function (companyList) {
        wx.showToast({
          title: '导出成功',
        })
        that.util('close');
      }
    })
    wx.showToast({
      title: '导出中',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
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