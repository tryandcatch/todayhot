//index.js
//获取应用实例
const app = getApp()
var sectionData = null
var currentSectionIndex = 0
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this 
    //获取分类信息 
    wx.request({ 
      url: 'http://api-hot.mrcuriosity.org/sites', 
      data : {}, 
      success : function(res){ 
        sectionData = res.data.sites; 
        sectionData[0]['active'] = true //默认选中第一个分类 
        that.loadArticles(sectionData[0]['id']) 
        that.setData({ sections : sectionData }); 
      } 
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }, 
  loadArticles: function (category_id) {
    var that = this //获取文章列表 
    wx.request({ 
      url: 'http://api-hot.mrcuriosity.org/sites/'+category_id+'/hot', 
      data : {}, 
      success : function(res){ 
        var articleData = res.data.list; 
        sectionData[currentSectionIndex]['articles'] = articleData
        that.setData({
          articles: articleData
        });
      } 
    }) 
  }, onArticleClicked: function (e) {
    var aid = e.currentTarget.dataset.aid
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  }, 
  onSectionClicked: function (e) {
    var sid = e.currentTarget.dataset.sid; //刷新选中状态 
    for(var i in sectionData){ 
      if(sectionData[i]['section_id'] == sid){ 
        sectionData[i]['active'] = true 
        currentSectionIndex = i 
      } else 
        sectionData[i]['active'] = false 
      } 
      this.setData({
        sections : sectionData 
      }); 
      //加载文章 
      if(sectionData[i]['articles']){ 
        this.setData({ 
          articles : sectionData[i]['articles'] 
        }); 
      }else{ 
        this.loadArticles(sid) 
      } 
    }
})
