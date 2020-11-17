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
        // 建议在移动端不初始化，其实 /search.xml 文件还挺大的，
        $.getScript('/js/search.js', function () {
            searchFunc("/search.xml", 'local-search-input', 'local-search-result');
        });
    })(jQuery);