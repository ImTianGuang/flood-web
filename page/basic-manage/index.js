Page({
  data: {
    manageItems: [
      {
        name: "职务管理",
        page: "pages/common-type/index?commonTypeEnum=0"
      },
      {
        name: "灾情类型管理",
        page: "pages/common-type/index?commonTypeEnum=1"
      },
      {
        name: "防汛措施类型管理",
        page: "pages/common-type/index?commonTypeEnum=2"
      },
      {
        name: "物资类型管理",
        page: "pages/common-type/index?commonTypeEnum=3"
      },
      {
        name: "修改密码",
        page: "pages/account/index"
      }
    ],
    uploadPageUrl: ""
  },
  onLoad: function () {
    var checkResult = getApp().globalData.checkResult;
    if (checkResult.isSuper) {
      var item = {
        name: "账号管理",
        page: "pages/account-manage/index"
      }
      var manageItems = this.data.manageItems;
      manageItems.push(item);
      this.setData({
        manageItems: manageItems
      })
    }
    this.setData({
      uploadPageUrl: getApp().globalData.serviceHost + "/manage/uploadFlood"
    })
  }
})