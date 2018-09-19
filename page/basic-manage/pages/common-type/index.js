var util = require('../../../../util/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonTypeEnum: 0,
    placeholder: "",
    commonTypeList: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.commonTypeEnum) {
      var placeholder = '请输入新的职务';
      if (options.commonTypeEnum == 1) {
        placeholder = '请输入新的汛情类型';
      } else if (options.commonTypeEnum == 2) {
        placeholder = '请输入新的防汛措施';
      } else if (options.commonTypeEnum == 3) {
        placeholder = '请输入新的物资类型';
      } else if (options.commonTypeEnum == 4) {
        placeholder = '请输入新的防汛头衔';
      }
      this.setData({
        placeholder: placeholder
      })
      this.fetchData(options.commonTypeEnum);
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

  onInputType: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    var list = this.data.commonTypeList;
    list[idx].name = value;
    this.setData({
      list: list
    });
  },

  subtractType: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var commonTypeList = this.data.commonTypeList;
   
    for (var i = 0, len = commonTypeList.length; i < len; i++) {
      if (idx == i) {
        commonTypeList[i].status = 0;
      }
    }
    this.setData({
      commonTypeList: commonTypeList
    });
  },

  addType: function () {
    var commonTypeList = this.data.commonTypeList;
    var commonType = {
      status: 1,
      commonTypeEnum: this.data.commonTypeEnum
    };
    commonTypeList.push(commonType);
    this.setData({
      commonTypeList: commonTypeList
    });
  },

  saveType: function() {
    var that = this;
    util.doPost(
      {
        url: getApp().globalData.serviceHost + '/manage/updateCommonType',
        data: that.data.commonTypeList,
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
          that.fetchData(that.data.commonTypeEnum);
        }
      }
    )
  },

  fetchData: function (commonTypeEnum) {
    var that = this;
    util.doGet({
      url: getApp().globalData.serviceHost + '/search/commonTypeList',
      data: {
        commonTypeEnum: commonTypeEnum
      },
      success: function (commonTypeList) {
        that.setData({
          commonTypeList: commonTypeList,
          commonTypeEnum: commonTypeEnum
        })
      }
    })
  }
})