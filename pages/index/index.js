// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    controls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer = options.timer;

    var self = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
    });

    // 设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          controls: [
            {
              id: 1,
              iconPath: '/image/location.png',
              position: {
                left: 20,
                top: res.windowHeight - 80,
                width: 50,
                height: 50
              },
              clickable: true
            },
            {
              id: 2,
              iconPath: '/image/use.png',
              position: {
                left: res.windowWidth/2 - 45,
                top: res.windowHeight - 100,
                width: 90,
                height: 90
              },
              clickable: true
            },
            {
              id: 3,
              iconPath: '/image/warn.png',
              position: {
                left: res.windowWidth - 70,
                top: res.windowHeight - 80,
                width: 50,
                height: 50
              },
              clickable: true
            },
            {
              id: 4,
              iconPath: '/image/marker.png',
              position: {
                left: res.windowWidth / 2 - 11,
                top: res.windowHeight / 2 - 45,
                width: 22,
                height: 45
              },
              clickable: false
            },
            {
              id: 5,
              iconPath: '/image/avatar.png',
              position: {
                left: res.windowWidth - 68,
                top: res.windowHeight - 155,
                width: 45,
                height: 45
              },
              clickable: true
            }
          ]
        })
      },
    });

    // 请求服务器，显示附近的单车，用marker标记
    wx.request({
      url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
      data: {},
      success: (res) => {
        this.setData({
          markers: res.data.data
        })
      }
    })
  },

  bindcontroltap: function(e) {
    var self = this;
    switch(e.controlId) {
      case 1: self.movetoPosition();
        break;
      case 2:
        if(self.timer === '' || self.timer === undefined) {
          wx.scanCode({
            success: function(res) {
              wx.showLoading({
                title: '正在获取密码',
                mask: true
              });
              wx.request({
                url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/password',
                data: {},
                method: 'GET',
                success: function(res) {
                  wx.hideLoading();
                  wx.redirectTo({
                    url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                    success: function(res) {
                      wx.showToast({
                        title: '获取密码成功',
                        duration: 1000
                      })
                    }
                  })
                }
              })
            }
          });
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
        break;
      case 3:
        wx.navigateTo({
          url: '../warn/index'
        });
        break;
      case 5:
        wx.navigateTo({
          url: '../my/index'
        });
        break;
      default: break;
    }
  },

  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function(e) {
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];

    this.setData({
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        },{
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF00DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },

  bindregionchange: function(e) {
    var self = this;
    if(e.type == 'begin') {
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
        data: {},
        method: 'GET',
        success: (res) => {
          self.setData({
            _markers: res.data.data
          })
        }
      })
    } else if (e.type == 'end') {
      this.setData({
        markers: this.data._markers
      })
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
    this.mapCtx = wx.createMapContext("ofoMap");
    this.movetoPosition();
  },

  movetoPosition: function() {
    this.mapCtx.moveToLocation();
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
    
  }
})