(function ($) {
    //
    // Search ------------
    var $searchWrap = $('.search-form-wrap'),
      isSearchAnim = false,
      searchAnimDuration = 200;
  
    var startSearchAnim = function () {
      isSearchAnim = true;
    };
  
    var stopSearchAnim = function (callback) {
      setTimeout(function () {
        isSearchAnim = false;
        callback && callback();
      }, searchAnimDuration);
    };
  
    $('.nav-item-search').on('click', function () {
      if (isSearchAnim) return;
      startSearchAnim();
      $searchWrap.addClass('on');
      stopSearchAnim(function () {
        $('.local-search-input').focus();
      });
    });
  
    $(document).mouseup(function (e) {
      var _con = $('.local-search');
      if (!_con.is(e.target) && _con.has(e.target).length === 0) {
        $searchWrap.removeClass('on');
      }
    });
  
    //
    // 移动设备侦测
    var isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };
  
    //
    // 建议在移动端不初始化，其实 /search.xml 文件还挺大的，
    if ($('.local-search').size() && !isMobile.any()) {
      $.getScript('/js/search.js', function () {
        searchFunc("/search.xml", 'local-search-input', 'local-search-result');
      });
    }
  })(jQuery);