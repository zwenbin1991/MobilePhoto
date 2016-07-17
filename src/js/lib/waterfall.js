/**
 * @description 瀑布流插件
 * @author 曾文彬
 * @date 2016.7.13
 */

'use strict';

import $ from 'jquery';

function Waterfall (selector) {
    if (Object.getPrototypeOf(this) !== Waterfall.prototype)
        return new Waterfall(selector);

    this.selector = selector;
    this.elements = $(selector);
    this.parent = this.elements.parent();
    this.columnHeight = [];
    this.columnCount = 2;
    this.columnVerticalGap = 0.2;
    this.unit = 'rem';
}

/**
 * 得到当前元素相对于body的top
 *
 * @private
 * @param {jqObject} element jquery对象
 * @return {Number} 相对于body的top
 */
Waterfall.prototype._getCurrentElementOffsetTop = element => {
    return element.offset().top;
};

/**
 * 高阶函数，遍历当前className === this.selector的元素，减少冗余代码
 *
 * @private
 * @param {Function} func 处理方法
 * @return {Function}
 */
Waterfall.prototype._iterateeElements = (func) => {
    const nativeSlice = Array.prototype.slice;

    return function () {
        nativeSlice
            .call(this.elements)
            .filter(element => element.classList.contains(this.selector.slice(1)))
            .forEach((element, index) => func.call(this, $(element), index));
    };
};

/**
 * 得到状态或删除状态 如：元素的属性节点、class等
 *
 * @private
 * @param {String} action 操作
 * @return {Function}
 */
Waterfall.prototype._state = action => {
    return (element, property) => {
        return element[action](property);
    };
};

/**
 * 删除元素属性节点
 *
 * @private
 * @param {jqObject} element jq对象
 * @param {String} property 属性名
 */
Waterfall.prototype._removeProperty = Waterfall.prototype._state('removeAttr');

/**
 * 得到元素属性节点
 *
 * @private
 * @param {jqObject} element jq对象
 * @param {String} property 属性名
 */
Waterfall.prototype._getProperty = Waterfall.prototype._state('attr');

/**
 * 删除元素class
 *
 * @private
 * @param {jqObject} element jq对象
 * @param {String} className
 */
Waterfall.prototype._removeClassName = Waterfall.prototype._state('removeClass');

/**
 * 检测当前向下滑动位置是否达到元素的offsetTop
 *
 * @private
 * @param {jqObject} element jq对象
 * @param {Number} offsetTop 当前元素相对于body的top
 * @return {Boolean}
 */
Waterfall.prototype._detectElementOffsetTop = (element, offsetTop) => {
    // 滚动条滚动的距离
    const scrollTop = $(window).scrollTop();

    // 元素相对于窗口的top
    const deltaY = offsetTop - scrollTop;

    // 当元素距离窗口的top小于窗口的高度并且滑动距离
    return deltaY < $(window).height() && (offsetTop + element.outerHeight(true)) > scrollTop;
};

/**
 * 懒加载
 */
Waterfall.prototype.lazyLoad = Waterfall.prototype._iterateeElements(function (element) {
    const offsetTop = this._getCurrentElementOffsetTop(element);
    let firstChild;

    if (this._detectElementOffsetTop(element, offsetTop)) {
        firstChild = element.children().eq(0);

        this._removeProperty(
            firstChild.css('background-image', 'url("'+ this._getProperty(firstChild, 'data-imgpath') +'")'),
            'data-imgpath'
        );
        this._removeClassName(element, this.selector.slice(1));
    }
});

/**
 * 计算每一个元素的left、top，并且更新父元素的高
 */
Waterfall.prototype.calcElementPosition = Waterfall.prototype._iterateeElements(function (element, index) {
    let fontSize = parseInt(document.documentElement.style.fontSize);
    let minHeight, maxHeight, minHeightColumnIndex, left, top;

    if (index < this.columnCount) {
        this.columnHeight[index] = element.outerHeight(true);
        left = index > 0 ? Number((element.outerWidth(true) / fontSize).toFixed(2)) + this.unit : 0;
        top = 0;
    } else {
        minHeight = Math.min.apply(Math, this.columnHeight);
        minHeightColumnIndex = this.columnHeight.indexOf(minHeight);
        left = Number((this.elements.eq(minHeightColumnIndex).position().left / fontSize).toFixed(2)) + this.unit;
        top = Number((minHeight / fontSize).toFixed(2)) + this.columnVerticalGap * Math.floor(index / this.columnCount)  + this.unit;
        this.columnHeight[minHeightColumnIndex] += element.outerHeight(true);
    }
    maxHeight = Math.max.apply(Math, this.columnHeight);
    this.parent.height(maxHeight);
    element.css({ left: left, top: top });
});

export default Waterfall;