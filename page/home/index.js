Page({
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500
  },

  onLoad: function (options) {
    var hasLogin = getApp().globalData.hasLogin;
    if (!hasLogin) {
      // 获取token
      wx.redirectTo({
        url: '../login/index',
      });
    }
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  
  toCompanyManage: function(e) {
    wx.switchTab({
      url: '../company/index?canManage=true',
    });
  }
})
