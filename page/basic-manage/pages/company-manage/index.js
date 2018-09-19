var util = require('../../../../util/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {
      status: 1
    }
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

  onInputName: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.name = value;

    this.setData({
      company: company
    })
  },

  onInputAddress: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.address = value;

    this.setData({
      company: company
    })
  },

  onInputEmail: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.email = value;

    this.setData({
      company: company
    })
  },

  onInputPostCode: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.postCode = value;

    this.setData({
      company: company
    })
  },

  saveCompany: function () {
    // valid
    var that = this;
    util.doPost({
      url: getApp().globalData.serviceHost + '/manage/updateCompanyList',
      data: this.data.company,
      success: function (data) {
        wx.showToast({
          title: "保存成功",
          icon: 'success',
          "duration": 800
        });
        that.setData({
          company: {
            status: 1
          }
        }  
        )
      }
    });
  }
})