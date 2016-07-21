/**
 * @description 预加载图片组件
 * @author 曾文彬
 * @date 2016.7.15
 */

'use strict';

import $ from 'jquery';

// 静态资源
import './largePhoto.css';
import tempCompileFunc from './largePhoto.handlebars';

import Swipe from 'lib/swipe';
import tap from 'lib/tap';

function LargePhoto (infos) {
    this.infos = infos;
    this.layoutSelector = '.large-photo';
    this.selector = '.large-photo-list-blk';
    this.photoSelector = '.grid-large-photo-cell';
}

LargePhoto.prototype.init = function () {
    this._willRender();
    this._render();
    this._didRender();
};

LargePhoto.prototype._initialStatus = function () {
    this.infos = this.infos.map(info => {
        const boundClientRect = this._getElementBoundClientRect(info.width, info.height);

        return {
            backgroundImage: info.largeImg ? info.largeImg.src : '',
            marginLeft: boundClientRect.left,
            marginTop: boundClientRect.top,
            width: boundClientRect.width,
            height: boundClientRect.height
        };
    });
};

LargePhoto.prototype._initialSwipe = function () {
    this.swipe = new Swipe({
        parentSelector: this.selector,
        pageSelector: this.photoSelector,
        dir: 1
    });
};

LargePhoto.prototype._getView = function () {
    return tempCompileFunc({ presetLargePhotos: this.infos });
};

LargePhoto.prototype._getElementBoundClientRect = function (width, height) {
    const heightWidthRatio = Number((height / width).toFixed(2));
    let left, top;

    // 如果是宽图片
    if (width > height) {
        width = window.innerWidth;
        height = heightWidthRatio * width;
        left = 0;
        top = (window.innerHeight - height) / 2;
    }
    // 如果是高图片
    else {
        height = window.innerHeight;
        width = height / heightWidthRatio;
        top = 0;
        left = (window.innerWidth - width) / 2;
    }

    return {
        left: left,
        top: top,
        width: width,
        height: height
    };
};

LargePhoto.prototype._bindEvents = function () {
    // 绑定 element tap事件
    tap(this.selector, this._tapListener.bind(this));
};

LargePhoto.prototype._tapListener = function () {
    this._hide();
};

LargePhoto.prototype._willRender = function () {
    this._initialStatus();
};

LargePhoto.prototype._render = function () {
    $('body').append(this._getView());
};

LargePhoto.prototype._didRender = function () {
    this._initialSwipe();
    this._bindEvents();
};

LargePhoto.prototype.show = function () {
    document.querySelector(this.layoutSelector).style.display = 'block';
};

LargePhoto.prototype._hide = function () {
    document.querySelector(this.layoutSelector).style.display = 'none';
};

export default LargePhoto;