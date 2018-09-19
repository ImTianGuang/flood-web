var util = require('../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:{},
    canMagage: false,
    createTime: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      canManage: getApp().globalData.canManage
    });
    var that = this;
    if(options.id) {
      util.doGet({
        url: getApp().globalData.serviceHost + '/search/messageInfo',
        data: {
          id: options.id
        },
        success: function(message) {
          var date = new Date();
          date.setTime(message.createTime);
          that.setData({
            message: message,
            createTime: date.toLocaleDateString()
          })
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  onTitleInput: function (e) {
    var message = this.data.message;
    message.title = e.detail.value;
    this.setData({
      message: message
    })
  },

  onContentInput: function (e) {
    var message = this.data.message;
    message.content = e.detail.value;
    this.setData({
      message: message
    })
  },

  save: function (e) {
    var message = this.data.message;
    debugger;
    util.doPost({
      url: getApp().globalData.serviceHost + '/manage/updateMessage',
      data: message,
      success: function (res) {
        wx.showToast({
          title: "保存成功",
          icon: 'success',
          "duration": 800
        });
      }
    })
  }
})