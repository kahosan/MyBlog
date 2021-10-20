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
    } else {
        $('#side-bar').removeClass('invisible');
        $('#side-bar').addClass('fadeInRight');
    }
    $('.site-title').click(function () {
        $('.site-title a')[0].click();
    })
});
function loadDisqus() {
    let dsqjs = new DisqusJS({
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

let runningOnBrowser = typeof window !== "undefined";

// 通过检查 scroll 事件 API 和 User-Agent 来匹配爬虫
let isBot = runningOnBrowser
    && !("onscroll" in window)
    || typeof navigator
    !== "undefined"
    && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent);

// 检查当前浏览器是否支持 IntersectionObserver API
let supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

if (!isBot && supportsIntersectionObserver) {
    // 当前环境不是爬虫、并且浏览器兼容 IntersectionObserver API
    var disqus_observer = new IntersectionObserver((entrise) => {
        loadDisqus();
        disqus_observer.disconnect();
    }, { threshold: [0] });
    // 设置让 Observer 观察 #disqus_thread 元素
    disqus_observer.observe(document.getElementById('disqus_thread'));
} else {
    // 当前环境是爬虫、或当前浏览器其不兼容 IntersectionObserver API
    // 直接加载 Disqus
    loadDisqus();
}
(() => {
    let disqAds = setInterval(() => {
        $("iframe").each((index, element) => {
            let id = /dsq-app/.test(element.name)
            let attr = element.hasAttribute("src")
            
            if (id && !attr) {
                element.remove()
                clearInterval(disqAds);
            }
        })
    }, 300);
})();