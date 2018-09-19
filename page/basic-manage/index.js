Page({
  data: {
    manageItems: [
      {
        name: "职务管理",
        page: "pages/common-type/index?commonTypeEnum=0"
      },
      {
        name: "汛情类型管理",
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
        name: "防汛机构头衔管理",
        page: "pages/common-type/index?commonTypeEnum=4"
      }
    ],
    uploadPageUrl: ""
  },
  onLoad: function () {
    this.setData({
      uploadPageUrl: getApp().globalData.serviceHost + "/manage/uploadFlood"
    })
  }
})