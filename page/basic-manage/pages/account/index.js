var util = require('../../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: "",
    password1: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onPasswordInput: function (e) {
    var password = e.detail.value;
    this.setData({
      password: password
    })
  },

  onPassword1Input: function (e) {
    var password1 = e.detail.value;
    this.setData({
      password1: password1
    })
  },
  save: function () {
    var password = this.data.password;
    var password1 = this.data.password1;
    if (password != password1) {
      wx.showToast({
        title: '密码不一致',
      });
      return;
    }
    var that = this;
    util.doPost({
      url: getApp().globalData.serviceHost + '/manage/changePassword',
      data: {
        token: getApp().globalData.checkResult.token,
        newPass: password
      },
      success: function (res) {
        wx.showToast({
          title: '修改成功',
        });
      }
    });
  }
})