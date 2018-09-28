var util = require('../../../util/util.js')

Page({
  data:{
    message: {
      title: "",
      content: ""
    },
    uploadUrl: getApp().globalData.serviceHost
  },

  onLoad: function (options) {
    if (options && options.id) {
      var that = this;
      util.doGet({
        url: getApp().globalData.serviceHost + '/search/messageInfo',
        data: {
          id: options.id
        },
        success: function (message) {
          that.setData({
            message: message
          })
        }
      });
      util.doGet({
        url: getApp().globalData.serviceHost + "/manage/uploadUrl",
        data: {
          uploadType: 1,
          refId: options.id
        },
        success: function (url) {
          var uploadUrl = that.data.uploadUrl;
          that.setData({
            uploadUrl: uploadUrl + url
          })
        }
      });
    }
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
    util.doPost({
      url: getApp().globalData.serviceHost + '/manage/updateMessage',
      data: message,
      success: function(res) {
        wx.showToast({
          title: "保存成功",
          icon: 'success',
          "duration": 800,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        });
      }
    })
  },
  delete: function (e) {
    var message = this.data.message;
    message.status = 0;
    util.doPost({
      url: getApp().globalData.serviceHost + '/manage/updateMessage',
      data: message,
      success: function (res) {
        wx.showToast({
          title: "删除成功",
          icon: 'success',
          "duration": 800,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        });
      }
    })
  },
  copy: function (e) {
    var uploadUrl = this.data.uploadUrl
    wx.setClipboardData({
      data: uploadUrl
    });
  }
})