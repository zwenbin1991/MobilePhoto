/**
 * @description 首页
 * @author 曾文彬
 * @date 2016.7.15
 */

'use strict';

import $ from 'jquery';

import Hash from 'lib/hash';
import MPhoto from 'modules/Photo';

var mPhoto = new MPhoto('.grid-photo-cell');

export default Object.create({
    render(element) {
        // 路由响应
        new Hash({
            defaultPage: 'photo',
            hashChangeWillHandler: function (method, args, context) {
                element.innerHTML = method.apply(context, args);
            }
        }).reg('photo', mPhoto)
          .run();
    }
});