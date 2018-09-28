var util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:"",
    userName:""
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

  login: function () {
    var userName = this.data.userName;
    var pass = this.data.password;
    if (!userName || userName == '') {
      wx.showToast({
        title: '请输入账号',
      })
      return;
    }
    if (!pass || pass == '') {
      wx.showToast({
        title: '请输入密码',
      })
      return;
    }

    util.doPost({
      url: getApp().globalData.serviceHost + "/manage/checkAccount",
      data: {
        userName: userName,
        password: pass
      },
      success: function (res) {
        if (res && res.result == true) {
          // 存储token
          wx.showToast({
            title: '登陆成功',
          });
          getApp().globalData.checkResult = res;
          getApp().globalData.hasLogin = true;
          wx.switchTab({
            url: '../home/index',
          });
        } else {
          wx.showToast({
            title: '登陆失败',
          });
        }
        
      },
      fail: function (res) {
        wx.showToast({
          title: '登陆失败',
        });
      }
    })
    
  },

  onPasswordInput (e) {
    var password = e.detail.value;
    this.setData({
      password: password
    })
  },

  onAccountInput (e) {
    var userName = e.detail.value;
    this.setData({
      userName: userName
    })
  }
})