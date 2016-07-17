/**
 * @description 首页
 * @author 曾文彬
 * @date 2016.7.15
 */

'use strict';

import $ from 'jquery';
import './photo.css';

import tPhoto from 'ejs!./photo.ejs';
import tap from 'lib/tap';


function Photo (selector, dataPath) {
    this.selector = selector;
    this.parentSelector = '.photo-list';
    this.dataPath = dataPath || '/data.json';
}

Photo.prototype.init = function () {
    this._willRender();
    this._bindEvents();
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

Photo.prototype._bindEvents = function () {
    // 绑定element tap事件
    tap(this.selector, function (e) {
        console.log('挖掘机');
    });
};

Photo.prototype._tapListener = () => {};

Photo.prototype._scrollListener = () => {};

Photo.prototype._willRender = function () {
    this._getAll()
        .then(photos => this.hashChangeWillHandler(this._render()), error => console.log(error));
};

Photo.prototype._render = (photos) => {
    return 'photo';
};

export default Photo;