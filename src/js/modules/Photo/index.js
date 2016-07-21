/**
 * @description 图片组件
 * @author 曾文彬
 * @date 2016.7.15
 */

'use strict';

import $ from 'jquery';

import './photo.css';
import tempCompileFunc from './photo.handlebars';

import tap from 'lib/tap';
import preload from 'lib/preload';
import Waterfall from 'lib/waterfall';

import MLargePhoto from 'modules/LargePhoto';

function Photo (columnCount, dataPath) {
    this.selector = '.grid-photo-cell';
    this.jsOperaSelector = '.js-photo';
    this.parentSelector = '.photo-list';
    this.columnCount = columnCount || 2;
    this.dataPath = dataPath || '/data.json';
}

Photo.prototype.init = function () {
    this._willRender();
};

Photo.prototype._getAll = function () {
    return new Promise((resolve, reject) => {
        $.getJSON(
            this.dataPath,
            data => resolve(data),
            error => reject(error)
        )
    });
};

Photo.prototype._getHeightWidthRatio = (height, width) => height / width;

Photo.prototype._initialLargePhoto = function (largePhotos) {
    this.largePhoto = new MLargePhoto(largePhotos);
    this.largePhoto.init();
};

Photo.prototype._initialHeight = function () {
    Array.prototype.slice.call(document.querySelectorAll(this.selector))
        .forEach(element => {
            const firstElementChild = element.firstElementChild;
            const heightWidthRation = this._getHeightWidthRatio(
                parseInt(firstElementChild.dataset.height),
                parseInt(firstElementChild.dataset.width)
            );
            firstElementChild.style['padding-top'] = (heightWidthRation * 100).toFixed(2) + '%';
        });
};

Photo.prototype._initialWaterfall = function () {
    this.waterfall = new Waterfall(this.jsOperaSelector, this.columnCount);
    this.waterfall.calcElementPosition();
    this.waterfall.lazyLoad();
};

Photo.prototype._bindEvents = function () {
    // 绑定element tap事件
    tap(this.parentSelector, this._tapListener.bind(this));

    // 绑定scroll事件
    window.onscroll = this._scrollListener.bind(this);
};

Photo.prototype._tapListener = function (e) {
    if (this.largePhoto) {
        this.largePhoto.swipe.setProperty('pageIndex', $(e.target).parent().index());
        this.largePhoto.swipe.swipe();
        this.largePhoto.show();
    }
};

Photo.prototype._scrollListener = function () {
    this.waterfall.lazyLoad();
};

Photo.prototype._willRender = function () {
    this._getAll()
        .then(photos => {
            this.photos = photos;
            this.hashChangeDidHandler(this._render());
            this._didRender();
        }, error => this.hashChangeDidHandler(error));
};

Photo.prototype._render = function () {
    return tempCompileFunc({ photos: this.photos });
};

Photo.prototype._didRender = function () {
    this._bindEvents();
    this._initialHeight();
    this._initialWaterfall();

    // 预加载大图
    preload(this.photos.map(photo => photo.largeImgPath)).then(largeImgPaths => {
        // 初始化largePhoto组件
        this._initialLargePhoto(largeImgPaths.map((largeImg, index) => {
            return {
                largeImg: largeImg,
                width: this.photos[index].width,
                height: this.photos[index].height
            };
        }));
    });
};

export default Photo;