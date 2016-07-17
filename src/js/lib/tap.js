/**
 * @description tap事件封装，解决click延迟300ms
 * @author 曾文彬
 * @date 2016.7.13
 */

'use strict';

function Tap (selector, handler) {
    const doc = document;
    const className = selector.slice(1);
    const deviceWidth = doc.documentElement.clientWidth;
    const deviceHeight = doc.documentElement.clientHeight;
    const swipeDeltaTimes = 0.05;
    const delay = 250;

    let startX, startY, touch, prevTimeStamp, isTriggerSwipe;

    doc.addEventListener('touchstart', e => {
        if (e.target.classList.contains(className)) {
            touch = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            prevTimeStamp = e.timeStamp;
        }
    }, false);

    doc.addEventListener('touchmove', () => {
        if (e.target.classList.contains(className)) {
            if (touch) {
                const deltaX = touch.pageX - startX;
                const deltaY = touch.pageY - startY;

                isTriggerSwipe = Math.abs(deltaX) / deviceWidth < swipeDeltaTimes &&
                    Math.abs(deltaY) / deviceHeight < swipeDeltaTimes;
            }
        }
    }, false);

    doc.addEventListener('touchend', e => {
        if (e.target.classList.contains(className)) {
            const currTimeStamp = e.timeStamp;

            if (isTriggerSwipe && currTimeStamp - prevTimeStamp <= delay)
                handler.call(doc, e);
        }
    }, false);
}

export default Tap;