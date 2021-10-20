var stage;
var siteNavShown = true;

function triggerSiteNav() {
    return;
    if (siteNavShown) {
        $('#site-nav').hide(300);
        siteNavShown = false;
    } else {
        $('#site-nav').show(300);
        siteNavShown = true;
    }
}
function updateSidebar() {
    if (window.innerWidth <= 768 || window.innerHeight <= 600) {
        $('#side-bar').innerWidth($('#stage').width());
        $('#main-container').removeClass('col-sm-9');
        //$('#site-nav').hide();
        //siteNavShown = false;
    } else {
        //$('#site-nav').show();
        //siteNavShown = true;
        var sidebarW =
            stage.width() - $('#main-container').outerWidth() + (window.innerWidth - stage.innerWidth()) / 2;
        $('#side-bar').outerWidth(sidebarW);
        console.log("sidebarW=" + sidebarW);
        $('#main-container').addClass('col-sm-9');
    }
}
$(document).ready(function () {
    stage = $('#stage');
    $(window).resize(function () {
        updateSidebar();
    });
    updateSidebar();
    $('#main-container').removeClass('invisible');
    $('#main-container').addClass('fadeInTop');
    if (window.innerWidth <= 768) {
        $('#side-bar').removeClass('invisible');
        $('#side-bar').addClass('fadeInTop');
    }else{
        $('#side-bar').removeClass('invisible');
        $('#side-bar').addClass('fadeInRight');
    }
    $('.site-title').click(function () {
        $('.site-title a')[0].click();
    })
});
function loadDisqus() {
    // Disqus 安装代码
    var dsqjs = new DisqusJS({
        shortname: '#{theme.disqus}',
        siteName: 'Kahosan',
        identifier: '#{page.path}',
        url: '#{config.url}/#{page.path}',
        title: '#{title}',
        api: 'https://disqus.skk.moe/disqus/',
        apikey: 'Fpzir1NPIs3LFQTzoT8bYrb1f2JWFk6GTf1GNSM8lUIcvsgZyAt9tbK0sxJ2hm7J',
        nocomment: '嘿，远道而来的旅行者，想喝点什么？',
        admin: 'disqus_sFK7L16tDo',
        adminLabel: ''
    });
}

// 通过检查 window 对象确认是否在浏览器中运行
var runningOnBrowser = typeof window !== "undefined";
// 通过检查 scroll 事件 API 和 User-Agent 来匹配爬虫
var isBot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent);
// 检查当前浏览器是否支持 IntersectionObserver API
var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

// 一个小 hack，将耗时任务包裹在 setTimeout(() => { }, 1) 中，可以推迟到 Event Loop 的任务队列中、等待主调用栈清空后才执行，在绝大部分浏览器中都有效
// 其实这个 hack 本来是用于优化骨架屏显示的。一些浏览器总是等 JavaScript 执行完了才开始页面渲染，导致骨架屏起不到降低 FCP 的优化效果，所以通过 hack 将耗时函数放到骨架屏渲染完成后再进行。
setTimeout(function () {
    if (!isBot && supportsIntersectionObserver) {
        // 当前环境不是爬虫、并且浏览器兼容 IntersectionObserver API
        var disqus_observer = new IntersectionObserver(function (entries) {
            // 当前视窗中已出现 Disqus 评论框所在位置
            if (entries[0].isIntersecting) {
                // 加载 Disqus
                loadDisqus();
                // 停止当前的 Observer
                disqus_observer.disconnect();
            }
        }, { threshold: [0] });
        // 设置让 Observer 观察 #disqus_thread 元素
        disqus_observer.observe(document.getElementById('disqus_thread'));
    } else {
        // 当前环境是爬虫、或当前浏览器其不兼容 IntersectionObserver API
        // 直接加载 Disqus
        loadDisqus();
    }
}, 1);