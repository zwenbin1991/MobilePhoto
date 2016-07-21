/**
 * @description 页面滑动插件
 * @author 曾文彬
 * @date 2016.7.13
 */

'use strict';

import $ from 'jquery';

function Swipe (options) {
    const defaultOptions = {
        parentSelector: '.page-container',          // 页父容器选择器
        pageSelector: '.page',                      // 页选择器
        duration: 250,                              // 动画持续时间
        dir: 0,                                     // 滑动方向
        isDrag: false,                              // 是否拖动
        deltaValue: 0.1,                            // 滑动距离倍数 当滑动的距离大于 deltaValue * 页面高度|页面宽度 从而开启滑动
        swipeWillHandler: function () {},           // 将要开始滑动处理函数
        swipeDidHandler: function () {}             // 滑动结束后处理函数
    };

    options = $.extend({}, defaultOptions, options);

    this.setProperty({
        parent: document.querySelector(options.parentSelector),
        duration: options.duration,
        dir: options.dir,
        isDrag: options.isDrag,
        deltaValue: options.deltaValue,
        swipeWillHandler: options.swipeWillHandler,
        swipeDidHandler: options.swipeDidHandler
    });

    this.setProperty({
        pages: this.parent.querySelectorAll(options.pageSelector),     // page集合
        pageIndex: 0,                                                  // 当前page索引
        isSwipe: false                                                 // 当前是否正在滑动
    });

    this.setProperty('pageLength', this.pages.length);                // 获取page的个数
    this._setParentSize();
    this._initEvents();
}

// 设置page父容器尺寸
Swipe.prototype._setParentSize = function () {
    const property = this.dir ? 'width' : 'height';
    const getProperty = 'inner' + property[0].toUpperCase() + property.slice(1);
    this.parent.style[property] = parseInt(window[getProperty]) * this.pageLength + 'px';
};

// 设置html属性
Swipe.prototype.setProperty = function (property, value) {
    if (typeof property === 'object')
        Object.keys(property).forEach(prop => this.setProperty(prop, property[prop]));
    else
        this[property] = value;
};

// 绑定事件
Swipe.prototype._initEvents = function () {
    const events = ['touchstart', 'touchend'];
    let listener;

    events.forEach(event => {
        listener = '_' + event + 'Listener';
        this.parent.addEventListener(event, this[listener].bind(this), true);
    });
};

// touch 监听器
Swipe.prototype._touchstartListener = function (e) {
    if (this.isSwipe)
        return;

    const touch = e.touches[0];
    this.startX = touch.pageX;
    this.startY = touch.pageY;

    e.stopPropagation();
    e.preventDefault();
};

Swipe.prototype._touchendListener = function (e) {
    const touch = e.changedTouches[0];
    const delta = this._getMoveDelta();

    // 确定滑动距离的倍数
    const deltaValue = this.dir ?
        (touch.pageX - this.startX) / delta : (touch.pageY - this.startY) / delta;


    // 是否达到滑动的条件，得到带有方向的滑动迭代值
    const dirIterate = Math.abs(deltaValue) > this.deltaValue ?
        deltaValue < 0 ? 1 : -1
        : 0;

    this._willSwipe(dirIterate);

    e.stopPropagation();
    e.preventDefault();
};

Swipe.prototype._willSwipe = function (dirIterate) {
    let currPageIndex = this.pageIndex;

    // 检测并更新当前页
    this.pageIndex = this._detectPageIndex(currPageIndex + dirIterate);

    // 滑动前，调用swipeWillHandler
    this.swipeWillHandler(currPageIndex);

    // 更新当前滑动状态
    this.isSwipe = true;

    // 滑动
    this.swipe();

    // 滑动后，调用swipeDidHandler
    setTimeout((function (currPageIndex, nextPageIndex) {
        this.isSwipe = false;
        this.swipeDidHandler(currPageIndex, nextPageIndex);
    }).bind(this, currPageIndex, this.pageIndex), this.duration);
};

Swipe.prototype.swipe = function () {
    const delta = this._getMoveDelta();
    let deltaX, deltaY;

    if (this.dir)
        deltaX = -this.pageIndex * delta, deltaY = 0;
    else
        deltaY = -this.pageIndex * delta, deltaX = 0;

    $(this.parent).css({
        'transform': 'translate3d('+ deltaX +'px, '+ deltaY +'px, 0px)',
        '-webkit-transform': 'translate3d('+ deltaX +'px, '+ deltaY +'px, 0px)'
    });
};

Swipe.prototype._getMoveDelta = function () {
    const property = this.dir ? 'outerWidth' : 'outerHeight';

    return $(this.pages).eq(this.pageIndex)[property](true);
};

Swipe.prototype._detectPageIndex = function (pageIndex) {
    if (pageIndex < 0)
        return 0;
    if (pageIndex >= this.pageLength)
        return this.pageLength - 1;

    return pageIndex;
};

export default Swipe;