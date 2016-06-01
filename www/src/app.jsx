/**
 * Author: Zane 448482356@qq.com
 */

import "./app.less";

window.$$ = Framework7.$;

// 实例化
window.F7 = new Framework7({
    modalTitle: '提示信息',
    modalButtonOk: '确认',
    modalButtonCancel: '取消',
    swipeBackPage: false,
    cache: false,
    swipePanel: 'left'
});

// 初始化视图
window.mainView = F7.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

$$(document).on('ajaxStart', function () {
    //F7.showIndicator();
});

$$(document).on('ajaxComplete', function () {
    F7.hideIndicator();
    F7.pullToRefreshDone();
});

$$(document).on('click', 'a[data-page]', function(e) {
    var link = $$(e.target);
    if (!link.is('a[data-page]')) {
        link = link.parents('a[data-page]');
    }
    var page = link.attr('data-page');
    var query = link.data('query');
    // 将参数重组成字面量对象
    if (query) {
        var queryArr = query.split('&');
        var q = {};
        for (var k in queryArr) {
            var qArr = queryArr[k].split('=');
            q[qArr[0]] = qArr[1];
        }
        query = q;
    }
    var view = link.attr('data-view');
    var container;
    if (view) {
        if (view == 'leftView') {
            container = leftView;
        } else {
            container = mainView;
        }
    } else {
        container = mainView;
    }
    container.router.load({
        content: '<div class="navbar"><div class="navbar-inner"></div></div><div class="page" data-page="' + page + '"></div>',
        query: query
    });
}, true);

$$(document).on('pageBeforeInit', function(e) {
    var page = e.detail.page;
    var navbar = require('view/' + page.name).navbar;
    $$(page.navbarInnerContainer).html(navbar);
});

$$(document).on('pageAfterAnimation', function(e) {
    var page = e.detail.page;
    var view = require('view/' + page.name);
    var PageContent = view.pageContent;
    var PageFooter = view.pageFooter;
    var PageClass = view.pageClass;
    if (PageClass) {
        $$(page.container).addClass(PageClass);
    }
    ReactDOM.render( 
        <PageContent query={page.query} />,
        page.container
    );
    if (PageFooter) {
        $$(page.container).append(PageFooter);
    }
});


let Home = require('view/home').pageContent;
ReactDOM.render( 
    <Home /> ,
    document.getElementById('init_page')
);