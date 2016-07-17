/**
 * @description 跨终端布局
 * @author 曾文彬
 * @date 2016.7.12
 */

'use strict';

function viewport () {
    const docElement = document.documentElement;
    const deviceWidth = docElement.clientWidth;
    docElement.style.fontSize = deviceWidth / 6.4 + 'px';
}

viewport();