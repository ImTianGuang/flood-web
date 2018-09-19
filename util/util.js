function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function doGet (reqData) {
  wx.request({
    url: reqData.url,
    data: reqData.data,
    method: 'GET',
    
    success: function(res) {
      if (res.data.ret) {
        reqData.success(res.data.data);
      } else {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'loading',
          "duration": 800
        });
        if(reqData.fail) {
          reqData.fail(res);
        }
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '未知错误',
        icon: 'loading',
        "duration": 1000
      });
      if (reqData.fail) {
        reqData.fail(res);
      }  
    },
  })
}

function doPost(reqData) {
  wx.request({
    url: reqData.url,
    data: reqData.data,
    method: 'POST',

    success: function (res) {
      if (res.data.ret) {
        reqData.success(res.data.data);
      } else {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'loading',
          "duration": 800
        });
        if (reqData.fail) {
          reqData.fail(res);
        }
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '未知错误',
        icon: 'loading',
        "duration": 1000
      });
      if (reqData.fail) {
        reqData.fail(res);
      }
    },
  })
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  doGet: doGet,
  doPost: doPost
}
