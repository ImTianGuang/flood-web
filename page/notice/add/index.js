var util = require('../../../util/util.js')

Page({
  data:{
    message: {
      title: "",
      content: ""
    }
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
  }
})