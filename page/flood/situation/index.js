var util = require('../../../util/util.js')

Page({
  data: {
    companyIdx:0,
    canManage:false,
    isAdd: true,
    companyList: null,
    situationTypeList: null,
    solutionTypeList: null,
    company: null,
    floodSituation:null,
    situationList:null,
    solutionList:null,
    floodCreateTime:""
  },

  onLoad: function (options) {
    var isAdd = true;
    
    var canManage = getApp().globalData.canManage;
    this.setData({
      canManage: canManage
      }
    )
    var situationId = options.situationId;
    var that = this;
    if(situationId) {
      util.doGet({
        url: getApp().globalData.serviceHost + '/search/situationInfo',
        data: {
          situationId: situationId
        },
        success: function (situationInfo) {
          var date = new Date();
          date.setTime(situationInfo.floodSituation.createTime);
          that.setData({
            company: situationInfo.company,
            floodSituation: situationInfo.floodSituation,
            situationList: situationInfo.situationDetailList,
            solutionList: situationInfo.solutionDetailList,
            floodCreateTime: date.toLocaleDateString()
          })
          that.matchAllTypes();
        }
      })
    }
   
    util.doGet({
      url: getApp().globalData.serviceHost + '/search/typeSummary',
      data: "",
      success: function (data) {
        var companyList = data.companyList;
        var situationTypeList = data.situationTypeList;
        var solutionTypeList = data.solutionTypeList;
        that.setData(
          {
            companyList: companyList,
            solutionTypeList: solutionTypeList,
            situationTypeList: situationTypeList
          }
        );
        that.matchAllTypes();
      }
    })
  },

  matchAllTypes: function (e) {
    var company = this.data.company;
    var companyList = this.data.companyList;
    var companyIdx = -1;
    if (company && companyList) {
      for (var i = 0, len = companyList.length;i<len;i++) {
        if(companyList[i].id == company.id) {
          this.setData({
            companyIdx: i
          })
        }
      }
    }
   
    var situationList = this.data.situationList;
    var situationTypeList = this.data.situationTypeList;
    if(situationList && situationTypeList) {
      for(var i=0,len=situationList.length;i<len;i++) {
        for (var j = 0, jlen = situationTypeList.length;j<jlen;j++) {
          if (situationList[i].targetId == situationTypeList[j].id) {
            situationList[i].idx = j;
          }
        }
      }
      this.setData({
        situationList: situationList
      })
    }

    var solutionList = this.data.solutionList;
    var solutionTypeList = this.data.solutionTypeList;
    if (solutionList && solutionTypeList) {
      for (var i = 0, len = solutionList.length; i < len; i++) {
        for (var j = 0, jlen = solutionTypeList.length; j < jlen; j++) {
          if (solutionList[i].targetId == solutionTypeList[j].id) {
            solutionList[i].idx = j;
          }
        }
      }
      this.setData({
        solutionList: solutionList
      })
    }
  },

  bindCompanyChange: function (e) {
    var idx = e.detail.value;
    var company = this.data.companyList[idx];
    this.setData({
      companyIdx: idx,
      company: company
    }
    )
  },

  bindSituationChange: function (e) {
    var situationIdx = e.currentTarget.dataset.idx;
    var idx = e.detail.value;
    var list = this.data.situationList;
    list[situationIdx].idx = idx;
    list[situationIdx].targetId = this.data.situationTypeList[idx].id;
    this.setData({
      situationList: list
    })
  },

  bindSolutionChange: function (e) {
    var situationIdx = e.currentTarget.dataset.idx;
    var idx = e.detail.value;
    var list = this.data.solutionList;
    list[situationIdx].idx = idx;
    list[situationIdx].targetId = this.data.solutionTypeList[idx].id;
    this.setData({
      solutionList: list
    })
  },

  onSituationInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    var list = this.data.situationList;
    list[idx].targetValue = value;

    this.setData({
      situationList: list
    });
  },

  onSolutionInput: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var value = e.detail.value;
    var list = this.data.solutionList;
    list[idx].targetValue = value;

    this.setData({
      solutionList: list
    });
  },

  onTitleInput: function (e) {
    var floodSituation = this.floodSituation;
    if (!floodSituation) {
      floodSituation = {
        status: 1
      }
    }
    floodSituation.title = e.detail.value
    this.setData({
      floodSituation: floodSituation
    })
  },

  addSituation: function() {
    var tempSituationList = this.data.situationList;
    if (!tempSituationList) {
      tempSituationList = [];
    }
    
    var situation = {};
    situation.companyId = this.data.companyList[this.data.companyIdx].id;
    situation.situationTargetCode = 0;
    situation.status = 1;
    var situationType = this.data.situationTypeList[0];
    situation.targetId = situationType.id;
    situation.idx = 0;

    tempSituationList.push(situation);

    this.setData(
      {
        situationList: tempSituationList
      }
    );
  },
  
  addSolution: function () {
    var tempSituationList = this.data.solutionList;
    if (!tempSituationList) {
      tempSituationList = [];
    }
    var situation = {};
    
    situation.companyId = this.data.companyList[this.data.companyIdx].id;
    situation.situationTargetCode = 1;
    situation.status = 1;
    var situationType = this.data.solutionTypeList[0];
    situation.targetId = situationType.id;
    situation.idx = 0;

    tempSituationList.push(situation);

    this.setData(
      {
        solutionList: tempSituationList
      }
    );
  },

  deleteSolution: function (e) {
    var idx = e.target.dataset.idx;
    var tempSituationList = this.data.solutionList;
    tempSituationList[idx].status = 0;
    this.setData(
      {
        solutionList: tempSituationList
      }
    );
  },
  deleteSituation: function(e) {
    var idx = e.target.dataset.idx;
    var tempSituationList = this.data.situationList;
    tempSituationList[idx].status = 0;
    this.setData(
      {
        situationList: tempSituationList
      }
    );
  },

  saveSituation: function() {
    
    var company = this.data.company;
    
    var floodSituation = this.data.floodSituation;
    if (!floodSituation) {
      floodSituation = {
        status : 1
      }
    }
    floodSituation.companyId = company.id;
    
    var situationList = this.data.situationList;
    if (situationList) {
      for (var i = 0, len = situationList.length; i < len; i++) {
        situationList[i].companyId = company.id;
      }
    }
    
    var solutionList = this.data.solutionList;
    if (solutionList) {
      for (var i = 0, len = solutionList.length; i < len; i++) {
        solutionList[i].companyId = company.id;
      }
    }
    

    var floodSituationInfo = {};
    floodSituationInfo.company = company;
    floodSituationInfo.floodSituation = floodSituation;
    floodSituationInfo.situationDetailList = situationList;
    floodSituationInfo.solutionDetailList = solutionList;
    util.doPost({
      url: getApp().globalData.serviceHost + '/manage/updateSituation',
      data: floodSituationInfo,
      success: function(res) {
        wx.showToast({
          title: "保存成功",
          icon: 'success',
          "duration": 800
        });
      }
    });
  }
})