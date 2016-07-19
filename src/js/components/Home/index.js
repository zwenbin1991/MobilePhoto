/**
 * @description 首页
 * @author 曾文彬
 * @date 2016.7.15
 */

'use strict';

import $ from 'jquery';

import Hash from 'lib/hash';
import MPhoto from 'modules/Photo';

var mPhoto = new MPhoto();

export default Object.create({
    render(element) {
        // 路由响应
        new Hash({
            defaultPage: 'photo',
            hashChangeDidHandler: function (html) {
                element.innerHTML = html;
            }
        }).reg('photo', mPhoto)
          .run();
    }
});