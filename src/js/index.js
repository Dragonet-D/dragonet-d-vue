$(function () {
  // 主页默认数据接口
  advanceData()
  // 微信接口
  weixinconfig()
  // 分享朋友圈
  shareFriend()
})

// 微信配置数据
var urls = location.href.split('#')[0]
var config = ''

// 微信config
function weixinconfig() {
  $.ajax({
    url: hosturl + '/index.php/Index/sing',
    type: 'post',
    dataType: 'json',
    async: false,
    data: {
      data: urls
    },
    success: function (data) {
      config = data;
      console.log(config)
    },
    error: function (err) {
      console.log(err)
    }
  });
}

// 广告 和 分类接口
$.ajax({
  url: hosturl + '/index.php/Newindex/ad',
  type: 'get',
  dataType: 'json',
  success: function (data) {
    console.log(data);
    // 轮播数据
    getAds(data.ad);
    // 默认选项卡内容
    defaultTagContent(data.cat)
  }
}).done(function () {
  // 轮播图
  var lunbo = new Swiper('.swiper-container', {
    loop: true,
    autoplay: 5000,
    pagination: '.swiper-pagination'
  });
  // 选项卡滑块
  var mySwiper = new Swiper('#tab', {
    freeMode: true,
    freeModeMomentumRatio: 0,
    slidesPerView: 'auto',
    freeModeMomentumVelocityRatio: 0,
    freeModeMomentumBounceRatio: 0,
    touchRatio: 0.5
  });
  // 选项卡外层
  var tab = $('#tab');
  var tabContents = document.querySelectorAll('.tabs');
  // 头部遮罩
  var tabMsk = $('.tab_mask');
  var header = $('.header');
  var homeadvance = $('#home_advance');
  // 选项卡构造函数
  var tabcenter = new TabCenter(tab, tabContents, tabMsk, mySwiper, homeadvance);
  tabcenter.init();
  var tabwrapper = $('#tab .swiper-wrapper').find('.swiper-slide').eq(0).addClass('active')
  // tab固定
  // var tabfixed = new TabFixed('#tab', '.header')
  // tabfixed.init()
});

var homeadvance = $('#home_advance');
// 传入后端的对象
var chooseObj = {
  id: '',
  tags: ''
};

// 主页默认数据接口
function advanceData(chooseObj) {
  console.log('chooseObj')
  $.ajax({
    url: hosturl + '/index.php/Newindex/info',
    type: 'get',
    dataType: 'json',
    data: chooseObj,
    success: function (data) {
      console.log(data)

      // 首页选项卡数据
      var tabInfo = data.info
      if (tabInfo) {
        tagContent(tabInfo)
      }
      // 直播数据
      var liveinfo = data.liveinfo
      if (liveinfo) {
        liveInfo(liveinfo)
      }
      // 切换筛选数据
      var otherdata = data.infolist
      if (otherdata) {
        othertagContent(otherdata)
      }
    },
    error: function (err) {
      console.log(err)
    }
  }).done(function () {
  })
}

// 其他选项卡内容
function othertagContent(otherdata) {
  var audioadvance = $('#audio_advance .audio_content')
  var videoaudio = $('.video_audio .list_content')
  for (var i = 0; i < otherdata.length; i++) {
    if (otherdata[i]) {
      var livetype = Number(otherdata[i].livetype) || '',
        id = otherdata[i].id,
        picture = otherdata[i].picture
      audiotitle = otherdata[i].content,
        title = otherdata[i].title,
        // time = otherdata[i].tag1.substring(0, otherdata[i].tag1.indexOf(',')),
        time = new Date(Number(otherdata[i].starttime) * 1000).toLocaleString()
      name = otherdata[i].name,
        ischoes = Number(otherdata[i].ischoes),
        price = otherdata[i].price
      // 语音消息
      if (livetype === 2) {
        logourl = 'https://cdn2.qnzsvk.cn/static/20170915/images/all_live_audio@2x.png'
        audioadvance.prepend(
          '<li class="audio_item">' +
          '<a class="audio_wrapper" href="' + hosturl + '/index.php/Index/livedeil_0/id/' + id + '">' +
          '<i class="icon">' +
          '<img src="' + picture + '" alt="">' +
          '</i>' +
          '<span class="audio_info">' +
          '<span class="audio_title">' + title + '</span>' +
          '<span class="audio_owner">' + name + '</span>' +
          '<span class="audio_hot">' +
          '<time>' + time + '</time>' +
          '</span>' +
          '</span>' +
          '</a>' +
          '</li>'
        )
      } else if (livetype === 1) {
        logourl = 'https://cdn2.qnzsvk.cn/static/20170915/images/all_live_video@2x.png'
        videoaudio.prepend(
          '<li class="single_video">' +
          '<a class="single_list_wrapper" href="' + hosturl + '/index.php/Index/livedeil/id/' + id + '">' +
          '<section class="list_header">' +
          '<span class="list_header_info">' +
          '<img class="class_type" src="' + logourl + '" alt="">' +
          '<p class="is_free">免费</p>' +
          '</span>' +
          '<img src="' + picture + '" alt="">' +
          '<span class="title">' +
          '<title class="video_introduce">' + title + '</title>' +
          '</span>' +
          '</section>' +
          '<p class="video_owner">' + name + '</p>' +
          '</a>' +
          '</li>'
        )
      }
    }
  }
  // loading样式消失
  loading('none')
}

// 获取遮罩数据接口
function getTagMask(id) {
  $.ajax({
    url: hosturl + '/index.php/Newindex/tags/id/' + id,
    type: 'get',
    dataType: 'jsonp',
    jsonp: 'jsonpcallback',
    success: function (data) {
      console.log(data)
    },
    error: function (err) {
      console.log(err)
    }
  }).done(function () {

  })
}

// 横向选项卡内容
function defaultTagContent(list) {
  var tabwrapper = $('#tab .swiper-wrapper')
  for (var i = 0; i < list.length; i++) {
    if (list[i].tag1 !== ' ') {
      var title = list[i].tag1
      console.log(title)
      var id = list[i].id
      tabwrapper.append(
        '<div class="swiper-slide" data-id="' + id + '">' +
        '<span>' + title + '</span>' +
        '</div>'
      )
    }
  }
}

// 纵向选项卡内容
function tagContent(tabInfo) {
  homeadvance.html(
    '<div id="class_advance" class="class_advance choose_craful" style="display: none">' +
    '<h2 class="live_advance">直播预告</h2>' +
    '<ul class="class_advance"></ul>' +
    '</div>'
  )
  for (var i = 0; i < tabInfo.length; i++) {
    var categoryname = tabInfo[i]['categoryname' + tabInfo[i].cid]
    var blockTitle = tabInfo[i]['cat' + tabInfo[i].cid]
    var str = ''
    // 心理健康
    if (categoryname === '心理健康课' || categoryname === '心理健康课') {
      var audiotitle = $('#audio_advance .audio_title')
      audiotitle.text(categoryname)
      var audiocontent = $('#audio_advance .audio_content')
      for (var k = 0; k < blockTitle.length; k++) {
        var id = blockTitle[k].id,
          picture = blockTitle[k].picture,
          name = blockTitle[k].name,
          audiotitle = blockTitle[k].title,
          //time = blockTitle[k].tag1.substring(0, blockTitle[k].tag1.indexOf(','))
          time = new Date(Number(blockTitle[k].starttime) * 1000).toLocaleString()
        audiocontent.append(
          '<li class="audio_item">' +
          '<a class="audio_wrapper" href="' + hosturl + '/index.php/Index/livedeil_0/id/' + id + '">' +
          '<i class="icon">' +
          '<img src="' + picture + '" alt="">' +
          '</i>' +
          '<span class="audio_info">' +
          '<span class="audio_title">' + audiotitle + '</span>' +
          '<span class="audio_owner">' + name + '</span>' +
          '<span class="audio_hot">' +
          '<time>' + time + '</time>' +
          '</span>' +
          '</span>' +
          '</a>' +
          '</li>'
        )
      }
    } else {
      var str = ''
      for (var j = 0; j < blockTitle.length; j++) {
        var listcontent = $('#home_advance .list_content')
        var ids = blockTitle[j].id,
          pictures = blockTitle[j].picture,
          names = blockTitle[j].name,
          audiotitles = blockTitle[j].title,
          livetype = Number(blockTitle[j].livetype),
          playurl = '',
          logourl = '',
          statuss = Number(blockTitle[j].statuss),
          ischoes = Number(blockTitle[j].ischoes),
          price = Number(blockTitle[j].price)
        // 语音课程
        if (livetype === 2) {
          playurl = 'livedeil_0'
          logourl = 'https://cdn2.qnzsvk.cn/static/20170915/images/all_live_audio@2x.png'
        } else { // 视频课程
          playurl = 'livedeil'
          logourl = 'https://cdn2.qnzsvk.cn/static/20170915/images/all_live_video@2x.png'
          if (statuss === 2) {
            if (price === 0.00) {
              playurl = 'livedeil'
            } else {
              if (ischoes === 2) {
                playurl = 'curdetailpage'
              } else {
                playurl = 'curdetail'
              }
            }
          } else if (statuss === 1) {
            playurl = 'livedeil'
          }
        }
        str +=
          '<li class="single_video">' +
          '<a class="single_list_wrapper" href="' + hosturl + '/index.php/Index/' + playurl + '/id/' + ids + '">' +
          '<section class="list_header">' +
          '<span class="list_header_info">' +
          '<img class="class_type" src="' + logourl + '" alt="">' +
          '<p class="is_free">免费</p>' +
          '</span>' +
          '<img src="' + pictures + '" alt="">' +
          '<span class="title">' +
          '<title class="video_introduce">' + audiotitles + '</title>' +
          '</span>' +
          '</section>' +
          '<p class="video_owner">' + names + '</p>' +
          '</a>' +
          '</li>'
      }
      homeadvance.append(
        '<div class="video_audio choose_craful">' +
        '<h2>' + categoryname + '</h2>' +
        '<ul class="list_content">' + str + '</ul>' +
        '</div>' +
        '<div id="audio_advance" class="audio_advance choose_craful">' +
        '<h2 class="audio_title"></h2>' +
        '<ul class="audio_content"></ul>' +
        '</div>'
      )
    }
  }
  setTimeout(function () {
    loading('none')
  }, 300)
}

// 直播信息函数
function liveInfo(liveinfo) {
  var advanveWrapper = $('#class_advance')
  var classadvanve = $('#class_advance .class_advance')
  var id = liveinfo.id,
    picture = liveinfo.picture,
    title = liveinfo.title,
    livetime = liveinfo.starttime,
    spker = liveinfo.spker,
    jianjie = liveinfo.jianjie,
    willlivetime = new Date(Number(liveinfo.starttime) * 1000).toLocaleString(),
    liveoff = Number(liveinfo.status),
    livetype = Number(liveinfo.livetype),
    liveurl = ''
  if (livetype === 1) {
    livetagsrc = "https://cdn2.qnzsvk.cn/static/20170915/images/all_live_video@2x.png"
    liveurl = 'livedeil'
  } else if (livetype === 2) {
    livetagsrc = "https://cdn2.qnzsvk.cn/static/20170915/images/all_live_audio@2x.png"
    liveurl = 'autolive'
  }
  if (liveoff === 1) {
    advanveWrapper.css('display', 'block')
    classadvanve.html(
      '<li class="live">' +
      '<a href="' + hosturl + '/index.php/Index/' + liveurl + '/id/' + id + '">' +
      '<span class="list_header">' +
      '<span class="list_header_info">' +
      '<img class="class_type" src="' + livetagsrc + '" alt="">' +
      '<p class="is_free">免费</p>' +
      '</span>' +
      '<img src="' + picture + '" alt="">' +
      '<span class="title all-cut-time">' +
      '</span>' +
      '</span>' +
      '<span class="live_introdus">' +
      '<span class="title">' + title + '</span>' +
      '<span class="live_user">' + spker + '</span>' +
      '<span id="living_mark" class="status">' + willlivetime + '</span>' +
      '</span>' +
      '</a>' +
      '</li>'
    )
  }

  // 模拟倒计时
  var startime = livetime;
  //是否直播1是0否
  var living = livetype;
  // 当前时间
  var timestamp = Math.round(new Date().getTime() / 1000);
  // 时间
  var newtime = startime - timestamp;
  var intDiff = newtime;
  // 直播倒计时函数
  countDown(intDiff, living);
}

// 轮播广告
function getAds(adlist) {
  var adWrapper = $('#banner .swiper-wrapper')
  for (var i = 0; i < adlist.length; i++) {
    var adjieshao = adlist[i].ad_jieshao
    var imgUrl = adlist[i].adpath
    var adurl = adlist[i].adurl
    adWrapper.append(
      '<div class="swiper-slide">' +
      '<a href="' + adurl + '">' +
      '<img src="' + imgUrl + '" alt="">' +
      '</a>' +
      '<h2 class="swiper_title">' + adjieshao + '</h2>' +
      '</div>'
    )
  }
}

// 选项卡构造函数
function TabCenter(tab, tabContents, tabMsk, Swiper, homeadvance) {
  // 选项卡外框
  this.tab = tab
  // 选项卡内容
  this.tabContents = tabContents
  // 滑块对象
  this.mySwiper = Swiper
  // 头部标签
  this.tabMsk = tabMsk
  // 选项卡宽度
  this.swiperWidth = Swiper.container[0].clientWidth
  // 最大移动距离
  this.maxTranslate = Swiper.maxTranslate()
  // 最大宽度
  this.maxWidth = this.swiperWidth / 2 - this.maxTranslate
  // 上一次点击的下标
  this.prevIndex = 0
  this.homeadvance = homeadvance
  // 选择的对象
  this.tagss = {}
  // 筛选的ID
  this.cid = {0: ''}
  // 开关
  this.onOff = true
}

// 选项卡构造函数 初始化函数
TabCenter.prototype.init = function () {
  var This = this
  this.mySwiper.on('tap', function (swiper) {
    This.slideClick(swiper, This)
  })
};
// 选项卡点击居中
TabCenter.prototype.slideClick = function (swiper, This) {
  // swiper-slide
  var slide = swiper.slides[swiper.clickedIndex]
  // 被点击slide的中心点
  var slideCenter = slide.offsetLeft + slide.clientWidth / 2
  // 点击下标
  var clickedIndex = swiper.clickedIndex
  // tab转场
  This.mySwiper.setWrapperTransition(10)
  console.log(slideCenter)
  console.log(This.swiperWidth / 2)
  if (slideCenter < This.swiperWidth / 2) {
    This.mySwiper.setWrapperTranslate(0)
    console.log(slideCenter)
  } else if (slideCenter > This.maxWidth) {
    This.mySwiper.setWrapperTranslate(This.maxTranslate)
  } else {
    var nowTlanslate = slideCenter - This.swiperWidth / 2
    This.mySwiper.setWrapperTranslate(-nowTlanslate)
  }
  // slide 加active样式
  This.slideActive(clickedIndex, This.tab)
  // 选项卡内容切换
  var tabContents = This.tabContents
  var slideContent = swiper.slides[clickedIndex].getElementsByTagName('span')[0].innerText;
  var slideobj = swiper.slides[clickedIndex]
  This.tabListChange(tabContents, clickedIndex, This, slideContent, slideobj)
};
// 选项卡加样式
TabCenter.prototype.slideActive = function (clickedIndex, tab) {
  tab.find('.active').removeClass('active')
  tab.find('.swiper-slide').eq(clickedIndex).addClass('active')
  var tabId = tab.find('.swiper-slide').eq(clickedIndex).attr('data-id')
};
// 选项卡内容切换
TabCenter.prototype.tabListChange = function (tabContents, index, This, slideContent, slideobj) {
  if (index === 0) {
    This.tabMsk.css('display', 'none')
    advanceData('')
  } else {
    homeadvance.html(
      '<div id="audio_advance" class="audio_advance choose_craful">' +
      '<ul class="audio_content">' + '</ul>' +
      '</div>' +
      '<div class="video_audio choose_craful">' +
      '<ul class="list_content">' + '</ul>' +
      '</div>'
    )
    var listcontent = ''
    var tabId = slideobj.getAttribute('data-id')
    var page = 0
    var onOff = true
    obj = {
      id: tabId,
      tags: '',
      page: page
    }
    $('#home_advance').dropload({
      scrollArea: window,
      domDown: {
        domClass: 'dropload-down',
        domRefresh: '',
        domLoad: '<div class="dropload-load"><img width="24" height="24" src="https://cdn2.qnzsvk.cn/static/20170919/qnvk_2.0/images/loading.gif" alt="">加载中...</div>',
        domNoData: '<div class="dropload-noData">- 暂时没有了哦 -</div>'
      },
      loadDownFn: function (me) {
        page++;
        // 拼接HTML
        var result = '';
        var logourl = ''
        $.ajax({
          url: hosturl + '/index.php/Newindex/info',
          type: 'get',
          dataType: 'json',
          data: {
            id: tabId,
            tags: '',
            page: page
          },
          success: function (data) {
            if (onOff) {
              if (data.infolist[0].livetype === '2') {
                console.log('语音')
                listcontent = $('#audio_advance .audio_content')
              } else if (data.infolist[0].livetype === '1') {
                console.log('视频')
                listcontent = $('#home_advance .list_content')
              }
              onOff = false
            }
            var arrLen = data.infolist.length;
            var otherdata = data.infolist
            if (arrLen > 0) {
              console.log(data)
              // 如果没有数据
              for (var i = 0; i < arrLen; i++) {
                var livetype = Number(otherdata[i].livetype),
                  id = otherdata[i].id,
                  picture = otherdata[i].picture
                audiotitle = otherdata[i].content,
                  title = otherdata[i].title,
                  // time = otherdata[i].tag1.substring(0, otherdata[i].tag1.indexOf(',')),
                  time = new Date(Number(otherdata[i].starttime) * 1000).toLocaleString()
                name = otherdata[i].name,
                  ischoes = Number(otherdata[i].ischoes),
                  price = otherdata[i].price
                if (livetype === 2) {
                  result +=
                    '<li class="audio_item">' +
                    '<a class="audio_wrapper" href="' + hosturl + '/index.php/Index/livedeil_0/id/' + id + '">' +
                    '<i class="icon">' +
                    '<img src="' + picture + '" alt="">' +
                    '</i>' +
                    '<span class="audio_info">' +
                    '<span class="audio_title">' + title + '</span>' +
                    '<span class="audio_owner">' + name + '</span>' +
                    '<span class="audio_hot">' +
                    '<time>' + time + '</time>' +
                    '</span>' +
                    '</span>' +
                    '</a>' +
                    '</li>'
                } else if (livetype === 1) {
                  result +=
                    '<li class="single_video">' +
                    '<a class="single_list_wrapper" href="' + hosturl + '/index.php/Index/livedeil/id/' + id + '">' +
                    '<section class="list_header">' +
                    '<span class="list_header_info">' +
                    '<img class="class_type" src="https://cdn2.qnzsvk.cn/static/20170915/images/all_live_video@2x.png" alt="">' +
                    '<p class="is_free">免费</p>' +
                    '</span>' +
                    '<img src="' + picture + '" alt="">' +
                    '<span class="title">' +
                    '<title class="video_introduce">' + title + '</title>' +
                    '</span>' +
                    '</section>' +
                    '<p class="video_owner">' + name + '</p>' +
                    '</a>' +
                    '</li>'
                }
              }
              console.log(result)
            } else {
              // 锁定
              me.lock();
              // 无数据
              me.noData();
              $('.dropload-down').text('- 加载完毕 -')
            }
            // 插入数据到页面，放到最后面
            listcontent.prepend(result);
            // 每次数据插入，必须重置
            me.resetload();
          },
          error: function (xhr, type) {
            alert('Ajax error!');
            // 即使加载出错，也得重置
            me.resetload();
          }
        });
      }
    });

    // 获取遮罩数据
    $.ajax({
      url: hosturl + '/index.php/Newindex/tags/id/' + tabId,
      type: 'get',
      dataType: 'json',
      success: function (data) {
        console.log(data.tagslist)
        // 遮罩数据渲染函数
        This.maskData(data.tagslist, This)
        if (data.tagslist.length) {
          This.tabMsk.css('display', 'block')
        } else {
          This.tabMsk.css('display', 'none')
        }
      },
      error: function (err) {
        console.log(err)
      }
    }).done(function () {
      // 选项卡过滤
      var tabMskDetials = This.tabMsk.get(0).getElementsByTagName('div')
      This.tabFilter(tabMskDetials, This)
    })
  }
  This.cid[0] = tabId
}
;
// 页面滚动
TabCenter.prototype.windowScroll = function () {
  $(window).scroll(function () {
    var bodyScroll = document.body.scrollTop || document.documentElement.scrollTop
    console.log(bodyScroll)
  })
}
// 遮罩数据点击过滤
TabCenter.prototype.tabFilter = function (maskcontent, This) {
  var itemA = null;
  for (var k = 0; k < maskcontent.length; k++) {
    itemA = maskcontent[k].querySelectorAll("span");
    maskcontent[k].prevNode = null;
    maskcontent[k].index = k;
    for (var m = 0; m < itemA.length; m++) {
      itemA[m].onOff = true
      itemA[m].addEventListener('touchstart', function () {
        var parent = this.parentNode;
        if (parent.prevNode) {
          parent.prevNode.className = ''
        }
        var str = ''
        // 点击切换筛选明细状态
        if (this.onOff) {
          this.className = 'search_active';
          this.onOff = false
          This.tagss[parent.index + 1] = this.getAttribute('data-id')
          for (var attr in This.tagss) {
            str += This.tagss[attr] + ','
          }
        } else {
          this.className = ''
          This.tagss[parent.index + 1] = ''
          this.onOff = true
          for (var key in This.tagss) {
            str += This.tagss[key] + ','
          }
        }
        parent.prevNode = this;
        // 传给后台筛选数据的参数
        var reg = /\d+/g
        if (reg.test(str)) {
          chooseObj.tags = str.match(reg).join(',') + ','
        } else {
          chooseObj.tags = ''
        }
        chooseObj.id = This.cid[0]
        console.log(chooseObj)
        // 数据筛选
        advanceData(chooseObj)
      })
    }
  }
};
// 遮罩数据获取;
TabCenter.prototype.maskData = function (data, This) {
  var str1 = '',
    str2 = '',
    str3 = '',
    sum = 0
  for (var i = 0; i < data.length; i++) {
    var tag2 = data[i].tag2,
      tag3 = data[i].tag3,
      tag4 = data[i].tag4,
      id2 = data[i].ta2,
      id3 = data[i].ta3,
      id4 = data[i].ta4
    if (tag2) {
      str1 += '<span data-id="' + id2 + '">' + tag2 + '</span>'
      This.tabMsk.find('.objects').find('h2').css('display', 'block')
      This.tabMsk.find('.objects').html('<h2>学科:</h2>' + str1)
    }

    if (tag3) {
      str2 += '<span data-id="' + id3 + '">' + tag3 + '</span>'
      This.tabMsk.find('.stages').find('h2').css('display', 'block')
      This.tabMsk.find('.stages').html('<h2>学段:</h2>' + str2)
    } else {
      sum++
      if (sum === data.length) {
        This.tabMsk.find('.stages').html(' ')
      }
    }
    if (tag4 && false) {
      str3 += '<span data-id="' + id4 + '">' + tag4 + '</span>'
      This.tabMsk.find('.classes').find('h2').css('display', 'block')
      This.tabMsk.find('.classes').html('<h2>年级:</h2>' + str3)
    }
  }
};
// 清空筛选对象
TabCenter.prototype.clearChooseObj = function (This) {
  for (var attr in This.chooseObj) {
    delete This.chooseObj[attr]
  }
};

// 固定tab
function TabFixed(tab, header) {
  this.tab = $(tab)
  this.headerHeight = $(header).height()
}

TabFixed.prototype.init = function () {
  var This = this
  $(window).scroll(function () {
    var bodyScroll = document.body.scrollTop || document.documentElement.scrollTop
    if (bodyScroll > This.headerHeight) {
      This.tab.css({
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 99
      })
    } else {
      This.tab.css({
        position: 'static'
      })
    }
  })
};

// 分享朋友圈
function shareFriend() {
  weixin();
  var title = '青年之声V课堂直播间'
  var link = window.location.href;
  var description = '青年V课堂邀请名校名师走进直播间从学习方法、升学攻略、心理健康等全方位为青少年成长助力。';
  var imgUrl = 'https://cdn2.qnzsvk.cn/live/Home/images/share_logo.png'
  var shareObj = {
    title: title,
    link: link,
    imgUrl: imgUrl,
    desc: description
  }
  wx.ready(function () {
    wx.onMenuShareTimeline(shareObj);
    wx.onMenuShareAppMessage(shareObj);
    wx.onMenuShareQQ(shareObj);
    wx.onMenuShareWeibo(shareObj);
    wx.onMenuShareQZone(shareObj);
  })
}

//微信配置
function weixin() {
  wx.config({
    // debug: true,
    appId: config.appId, // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature, // 必填，签名，见附录1 ba939f772c41cadd1175bcedb4f9ec6627578484
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone'
    ]
  });
}

// 直播倒计时函数
function countDown(intDiff, living) {
  // 设置定时器
  var timer = null;
  timer = setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;
    //时间默认值
    if (intDiff > 0) {
      day = Math.floor(intDiff / (60 * 60 * 24));
      hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
      minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      if (minute <= 9)
        minute = '0' + minute;
      if (second <= 9)
        second = '0' + second;
    } else if (intDiff < 0 && living === 1) {
      $('.all-cut-time').html(
        '<span class="video_introduce">直播进行中...</span>'
      );
      $('#living_mark').html('直播中...')
      // 清除定时器
      clearInterval(timer);
      return;
    } else if (living === 2) {
      $('.all-cut-time').html(
        '<span class="video_introduce">直播进行中...</span>'
      );
      $('#living_mark').html('直播中...')
      // 清除定时器
      clearInterval(timer);
      return;
    }
    $('.all-cut-time').html(
      '<span>倒计时：</span>' +
      '<span>' + day + '天' + hour + '时' + minute + '分' + second + '秒' + '</span>'
    )
    intDiff--;
  }, 1000);
}

// loading样式
function loading(showhide) {
  $('.loading').css('display', showhide)
}