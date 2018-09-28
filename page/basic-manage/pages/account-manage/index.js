var util = require('../../../../util/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonTypeEnum: 0,
    placeholder: "",
    accountList: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.fetchData();

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

  onInputUserName: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    var list = this.data.accountList;
    list[idx].userName = value;
    this.setData({
      list: list
    });
  },

  onInputPassword: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    var list = this.data.accountList;
    list[idx].password = value;
    this.setData({
      list: list
    });
  },

  subtractType: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var accountList = this.data.accountList;
    accountList[idx].status = 0;

    this.setData({
      accountList: accountList
    });
  },

  addType: function () {
    var accountList = this.data.accountList;
    var account = {
      id: -1,
      status: 1,
      userName: "",
      password:""
    };
    accountList.push(account);
    this.setData({
      accountList: accountList
    });
  },

  saveType: function () {
    var that = this;
    util.doPost(
      {
        url: getApp().globalData.serviceHost + '/manage/updateAccountList',
        data: {
          token: getApp().globalData.checkResult.token,
          accountList: that.data.accountList
        },
        success: function (data) {
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
      }
    )
  },

  fetchData: function () {
    var that = this;
    util.doGet({
      url: getApp().globalData.serviceHost + '/manage/accountList',
      data: {
        token: getApp().globalData.checkResult.token
      },
      success: function (accountList) {
        that.setData({
          accountList: accountList
        })
      }
    })
  }
})