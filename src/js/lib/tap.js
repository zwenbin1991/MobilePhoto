/**
 * @description tap事件封装，解决click延迟300ms
 * @author 曾文彬
 * @date 2016.7.13
 */

'use strict';

function Tap (selector, handler) {
    const doc = document;
    const element = document.querySelector(selector);
    const deviceWidth = doc.documentElement.clientWidth;
    const deviceHeight = doc.documentElement.clientHeight;
    const swipeDeltaTimes = 0.05;
    const delay = 250;

    let isTriggerSwipe = true;
    let startX, startY, touch, prevTimeStamp;

    element.addEventListener('touchstart', e => {
        touch = e.touches[0];
        startX = touch.pageX;
        startY = touch.pageY;
        prevTimeStamp = e.timeStamp;

        e.stopPropagation();
        e.preventDefault();
    }, false);

    element.addEventListener('touchmove', e => {
        if (touch) {
            const deltaX = touch.pageX - startX;
            const deltaY = touch.pageY - startY;

            isTriggerSwipe = Math.abs(deltaX) / deviceWidth < swipeDeltaTimes &&
                Math.abs(deltaY) / deviceHeight < swipeDeltaTimes;
        }

        e.stopPropagation();
        e.preventDefault();
    }, false);

    element.addEventListener('touchend', e => {
        const currTimeStamp = e.timeStamp;

        if (isTriggerSwipe && currTimeStamp - prevTimeStamp <= delay)
            handler.call(doc, e);

        e.stopPropagation();
        e.preventDefault();
    }, false);
}

export default Tap;