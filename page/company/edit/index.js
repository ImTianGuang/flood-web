var util = require('../../../util/util.js')
//index.js
//获取应用实例
const app = getApp();
const baseUrl = "你服务部署的网址/weather/";
var WxSearch = require('../../../wxSearchView/wxSearchView.js');

Page({
  data: {
    hidenSaveButton:true,
    companyId: -1,
    fromManage: false,
    company: {},
    list: [
     {
        id: 'basic',
        name: '基本信息',
        open: false,
        data: {}
      },{
      id: 'phones',
      name: '通讯录',
      open: false,
      data: {}
    }, {
        id: 'asserts',
        name: '物资',
        open: false,
        data: {}
      }, {
        id: 'plan',
        name: '防汛预案',
        open: false,
        data: {}
      }
      ],
    positions:[],
    assertsTypeList:[],
    floodTitleList:[],
    uploadUrl: getApp().globalData.serviceHost
  },


  onShow: function () {
    if (this.isFormSearch) {
      this.isFormSearch = false;
      return;
    }
    var that = this;
    
  },

  // 搜索页面跳回
  onLoad: function (options) {
    if (options && options.id) {
      var fromManage = options.fromManage && (options.fromManage == 'true');
      var that = this;
      that.setData(
        {
          companyId: options.id,
          fromManage: fromManage
        }
      );

      util.doGet({
        url: app.globalData.serviceHost + "/search/typeSummary",
        success: function (typeSummary) {
          that.setData(
            {
              companyId: options.id,
              assertsTypeList: typeSummary.assertsTypeList,
              positions: typeSummary.positionList,
              floodTitleList: typeSummary.floodTitleList
            }
          );

          var list = that.data.list;
          var assertsList = list[2].data.assertsList;
          var phoneList = list[1].data.phoneList;
          
          that.matchAssertsIdx(assertsList, typeSummary.assertsTypeList);
          that.matchPhoneList(phoneList, typeSummary.positionList);
          list[2].data.assertsList = assertsList;
          list[1].data.phoneList = phoneList;

          that.setData({
            list: list
          });
        }
      });
      that.fetchData();  
      util.doGet({
        url: getApp().globalData.serviceHost + "/manage/uploadUrl",
        data: {
          uploadType: 0,
          refId: options.id,
          title: '防汛预案上传'
        },
        success: function (url) {
          var uploadUrl = that.data.uploadUrl;
          that.setData({
            uploadUrl: uploadUrl + url
          })
        }
      }) 
    }
  },

  fetchData: function () { 
    var that = this;
    var companyId = that.data.companyId;
    if (companyId) {
      util.doGet({
        url: app.globalData.serviceHost + "/search/companyInfo",
        data: {
          companyId: that.data.companyId
        },
        fail: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
            }, 500);
        },
        success: function (companyInfo) {
          var phoneData = {};
          var assertsData = {};
          var phoneList = companyInfo.phoneList;
          var assertsList = companyInfo.assertsList;
          phoneData.phoneList = phoneList;
          assertsData.assertsList = assertsList;
          var tempList = that.data.list;
          tempList[1].data = phoneData;
          tempList[2].data = assertsData;

          that.setData({
            list: tempList,
            company: companyInfo.company
          });
          phoneList = phoneData.phoneList;
          assertsList = assertsData.assertsList;
          that.matchAssertsIdx(assertsList, that.data.assertsTypeList);
          that.matchPhoneList(phoneList, that.data.positions);

          that.setData({
            list: tempList
          });
        }
      });
    }
  },

  matchAssertsIdx: function(assertsList, assertsTypes) {
    if (assertsList && assertsTypes) {
      for(var i=0,len=assertsList.length;i<len;i++) {
        for(var j=0,jlen=assertsTypes.length;j< jlen;j++) {
          if (assertsList[i].assertsTypeId == assertsTypes[j].id) {
            assertsList[i].assertsTypeIdx = j;
          }
        }
      }
    }
  },

  matchPhoneList: function(phoneList, positionList) {
  
    if(phoneList && positionList) {
      for(var i=0,len=phoneList.length;i<len;i++) {
        if(phoneList[i].userList) {
          var userList = phoneList[i].userList;
        
          for (var ii = 0, ilen = userList.length;ii<ilen;ii++) {
            for (var j = 0, jlen = positionList.length;j<jlen;j++) {
              if (userList[ii].positionId == positionList[j].id) {
                userList[ii].positionIdx = j;
              }
            }
          }
        }
      }
    }
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    var hidenSaveButton = true;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
        hidenSaveButton = !list[i].open;
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list,
      hidenSaveButton: hidenSaveButton
    });
  },

  addPhones: function (e) {
    var attributionId = e.currentTarget.dataset.attributionid;
    var list = this.data.list;
    var phoneData = {};
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i].id == 'phones') {
        phoneData = list[i].data;
      }
    }

    var user = {
      title: "",
      workPhone: "",
      phone: "",
      positionIdx: 1,
      isLast: true,
      status: 1,
      floodTitle: this.data.floodTitleList[0].name
    };
    var attribution = {};
    for (var i = 0, len = phoneData.phoneList.length; i < len; i++) {
      if (phoneData.phoneList[i].id == attributionId) {
        var attribution = phoneData.phoneList[i];
      }
    }

    for(var i=0,len=attribution.userList.length;i<len;i++) {
      attribution.userList[i].isLast=false;
    }

    attribution.userList.push(user);
    this.setData({
      list:list
    })
  },

  deletePhones: function (e) {

    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;

    var list = this.data.list;
    list[1].data.phoneList[phoneIdx].userList[idx].status = 0;
    
    this.setData({
      list:list
    })
  },

  save: function(e) {
    var companyInfo = {};
    companyInfo.company = this.data.company;
    var list = this.data.list;
    companyInfo.phoneList = list[1].data.phoneList;
    companyInfo.assertsList = list[2].data.assertsList;
    var that = this;
    console.log(companyInfo)
    util.doPost({
      url: app.globalData.serviceHost + "/manage/updateCompany",
      data: companyInfo,
      success: function (company) {
        that.setData(
          {
            company: company,
            companyId: company.id
          }
        )
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
    });
  },

  doDelete: function () {
    var company = this.data.company;
    if (company.id == -1) {
      wx.showToast({
        title: "删除成功",
        icon: 'success',
        "duration": 1000,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      });
      return;
    }
    company.status = 0;
    var companyInfo = {};
    companyInfo.company = company;
    util.doPost({
      url: app.globalData.serviceHost + "/manage/updateCompany",
      data: companyInfo,
      success: function (companyInfo) {
        wx.showToast({
          title: "删除成功",
          icon: 'success',
          "duration": 1000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        });
        
      }
    });
  },
  addAsserts: function() {
    var list = this.data.list;
    
    var assertsList = list[2].data.assertsList;
    var assertsType = this.data.assertsTypeList[0];
    var asserts = {
      assertsTypeId: assertsType.id,
      assertsTypeIdx: 0,
      assertsTypeName: assertsType.name,
      assertsValue: "3",
      companyId: this.data.company.id,
      status: 1
    };
    assertsList.push(asserts);
    this.setData({
      list: list
    })
  },

  deleteAsserts: function(e) {
    var list = this.data.list;
    var idx = e.currentTarget.dataset.index;
    list[2].data.assertsList[idx].status = 0;
    this.setData({
      list: list
    })
  },
  
  onTitleInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var value = e.detail.value;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    phoneList[phoneIdx].userList[idx].title = value;
    this.setData({
      list: list
    });
  },

  onNameInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var value = e.detail.value;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    phoneList[phoneIdx].userList[idx].userName = value;
    this.setData({
      list: list
    });
  },
  onWorkPhoneInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var value = e.detail.value;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    phoneList[phoneIdx].userList[idx].workPhone = value;
    this.setData({
      list: list
    });
  },
  onPhoneInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var value = e.detail.value;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    phoneList[phoneIdx].userList[idx].userPhone = value;
    this.setData({
      list: list
    });
  },
  onFaxInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var value = e.detail.value;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    phoneList[phoneIdx].userList[idx].fax = value;
    this.setData({
      list: list
    });
  },
  bindPositionChange: function (e) {
    var value = e.detail.value;
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    var position = this.data.positions[value];
    var user = phoneList[phoneIdx].userList[idx];
    user.positionIdx = value;
    user.positionId = position.id;
    this.setData({
      list: list
    });
  },
  bindFloodTitleChange: function (e) {
    var value = e.detail.value;
    var idx = e.currentTarget.dataset.idx;
    var phoneIdx = e.currentTarget.dataset.phoneidx;
    var list = this.data.list;
    var phoneList = list[1].data.phoneList;
    var floodTitle = this.data.floodTitleList[value];
    var user = phoneList[phoneIdx].userList[idx];
    user.floodTitleIdx = value;
    user.floodTitle = floodTitle.name;
    this.setData({
      list: list
    });
  },

  bindAssertsChange: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    var list = this.data.list;
    var asserts = list[2].data.assertsList[idx];
    var assertsType = this.data.assertsTypeList[value];
    asserts.assertsTypeIdx = value;
    asserts.assertsTypeId = assertsType.id;
    asserts.assertsTypeName = assertsType.name;
    this.setData({
      list: list
    })
  },
  onPlanConfirm: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.floodPlan = value;
    this.setData({
      company: company
    })
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

  onInputCheckPerson: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.checkPerson = value;

    this.setData({
      company: company
    })
  },

  onInputCheckPersonPhone: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.checkPersonPhone = value;

    this.setData({
      company: company
    })
  },

  onInputRecordPersonPhone: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.recordPersonPhone = value;

    this.setData({
      company: company
    })
  },

  onInputRecordPerson: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.recordPerson = value;

    this.setData({
      company: company
    })
  },

  onInputfloodManager: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.floodManager = value;

    this.setData({
      company: company
    })
  },

  onInputdManagerPhone: function (e) {
    var value = e.detail.value;
    var company = this.data.company;
    company.floodManagerPhone = value;

    this.setData({
      company: company
    })
  },

  onAssertsInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var list = this.data.list;
    list[2].data.assertsList[idx].assertsValue = e.detail.value;
    this.setData({
      list: list
    });
  },

  bindRecordDateChange: function (e) {
    var company = this.data.company;
    company.recordDate = e.detail.value;
    this.setData({
      company: company
    })
  },

  copy: function (e) {
    var uploadUrl = this.data.uploadUrl
    wx.setClipboardData({
      data: uploadUrl
    });
  }
})